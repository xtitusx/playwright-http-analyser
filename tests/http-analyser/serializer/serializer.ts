import { HttpAnalyser } from '../http-analyser';

export abstract class Serializer {
    protected httpAnalyser: HttpAnalyser;

    constructor(httpAnalyser: HttpAnalyser) {
        this.httpAnalyser = httpAnalyser;
    }

    public abstract serialize(): void;

    /**
     * Remove all recorded reports.
     */
    public abstract clean(): void;
}
