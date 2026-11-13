/**
 * Injection token for the JobQueue abstraction — spec §39.
 * Use this token to inject JobQueue anywhere in the application.
 *
 * @example
 * constructor(@Inject(JOB_QUEUE) private readonly queue: JobQueue) {}
 */
export const JOB_QUEUE = Symbol("JOB_QUEUE");
