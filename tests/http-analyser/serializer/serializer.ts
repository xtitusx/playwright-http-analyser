import { HttpAnalyser } from '../http-analyser';

export abstract class Serializer {
    protected httpAnalyser: HttpAnalyser;

    constructor() {}

    public abstract serialize(httpAnalyser: HttpAnalyser): string;

    /**
     * Removes all recorded reports.
     */
    public abstract clean(): Promise<void>;
}
