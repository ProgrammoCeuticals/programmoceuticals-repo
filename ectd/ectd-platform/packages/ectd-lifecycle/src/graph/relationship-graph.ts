/**
 * RelationshipGraph — spec §15, §18.
 *
 * Tracks Context of Use relationships (REPLACES, DERIVES_FROM, etc.)
 * across the lifecycle of a regulatory application.
 *
 * Spec §18: DocumentRelationship, ContextOfUseRelationship, and
 * DocumentLink are different things and must not be collapsed.
 *
 * The graph is used to:
 *   - Verify a CoU is not already in a replacement chain
 *   - Detect cycles in replacement relationships
 *   - Resolve the full lineage of a CoU for audit/display
 *   - Validate M:1 / 1:M / M:M replacement operations
 */

export type CoURelationshipType = "REPLACES" | "DERIVES_FROM";

export interface CoURelationship {
  id: string;
  sourceContextId: string; // the replacing CoU
  targetContextId: string; // the CoU being replaced
  relationshipType: CoURelationshipType;
}

export interface GraphNode {
  couId: string;
  status: string;
  relationships: CoURelationship[];
}

export class RelationshipGraph {
  private readonly nodes: Map<string, GraphNode> = new Map();

  addNode(couId: string, status: string): void {
    if (!this.nodes.has(couId)) {
      this.nodes.set(couId, { couId, status, relationships: [] });
    }
  }

  addRelationship(rel: CoURelationship): void {
    // Ensure both nodes exist
    if (!this.nodes.has(rel.sourceContextId)) {
      this.nodes.set(rel.sourceContextId, {
        couId: rel.sourceContextId,
        status: "UNKNOWN",
        relationships: [],
      });
    }
    if (!this.nodes.has(rel.targetContextId)) {
      this.nodes.set(rel.targetContextId, {
        couId: rel.targetContextId,
        status: "UNKNOWN",
        relationships: [],
      });
    }

    this.nodes.get(rel.sourceContextId)!.relationships.push(rel);
  }

  /**
   * Detect if adding a REPLACES relationship from source → target would
   * create a cycle in the graph.
   *
   * A cycle would mean a CoU transitively replaces itself, which is
   * an invalid lifecycle state.
   */
  wouldCreateCycle(sourceContextId: string, targetContextId: string): boolean {
    // BFS from target — if we can reach source, adding this edge creates a cycle
    const visited = new Set<string>();
    const queue = [targetContextId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === sourceContextId) return true;
      if (visited.has(current)) continue;
      visited.add(current);

      const node = this.nodes.get(current);
      if (!node) continue;

      // Follow REPLACES edges outward from current (what current replaces)
      for (const rel of node.relationships) {
        if (
          rel.relationshipType === "REPLACES" &&
          rel.sourceContextId === current
        ) {
          queue.push(rel.targetContextId);
        }
      }
    }

    return false;
  }

  /**
   * Get all CoUs that a given CoU has been replaced by (direct and transitive).
   * Returns in order from direct to most distant replacement.
   */
  getReplacedBy(couId: string): string[] {
    const result: string[] = [];
    const visited = new Set<string>();

    const traverse = (id: string): void => {
      if (visited.has(id)) return;
      visited.add(id);

      for (const [, node] of this.nodes) {
        for (const rel of node.relationships) {
          if (
            rel.relationshipType === "REPLACES" &&
            rel.targetContextId === id
          ) {
            result.push(rel.sourceContextId);
            traverse(rel.sourceContextId);
          }
        }
      }
    };

    traverse(couId);
    return result;
  }

  /**
   * Get all CoUs that this CoU replaces (direct and transitive).
   */
  getReplaces(couId: string): string[] {
    const result: string[] = [];
    const visited = new Set<string>();

    const traverse = (id: string): void => {
      if (visited.has(id)) return;
      visited.add(id);

      const node = this.nodes.get(id);
      if (!node) return;

      for (const rel of node.relationships) {
        if (rel.relationshipType === "REPLACES" && rel.sourceContextId === id) {
          result.push(rel.targetContextId);
          traverse(rel.targetContextId);
        }
      }
    };

    traverse(couId);
    return result;
  }

  getNode(couId: string): GraphNode | undefined {
    return this.nodes.get(couId);
  }

  getNodeCount(): number {
    return this.nodes.size;
  }
}
