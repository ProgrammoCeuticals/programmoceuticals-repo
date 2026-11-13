/**
 * LifecyclePolicy injection token — spec §15, §57 Rule 15.
 *
 * The concrete implementation is LifecycleEngine in
 * packages/ectd-lifecycle/src/engine/lifecycle-engine.ts.
 *
 * Command and result types are exported from the engine module.
 */

export const LIFECYCLE_POLICY = Symbol("LIFECYCLE_POLICY");
