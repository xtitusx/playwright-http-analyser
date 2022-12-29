import { HttpAnalyser } from '../http-analyser';

export abstract class Serializer {
    protected httpAnalyser: HttpAnalyser;

    constructor() {}

    public abstract serialize(httpAnalyser: HttpAnalyser): void;

    /**
     * Remove all recorded reports.
     */
    public abstract clean(): void;
}
