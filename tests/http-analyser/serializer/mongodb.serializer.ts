import { HttpAnalyser } from '../http-analyser';
import { Serializer } from './serializer';

export class MongoDbSerializer extends Serializer {
    constructor() {
        super();
    }

    /**
     * @override
     * @param httpAnalyser
     */
    public serialize(httpAnalyser: HttpAnalyser): void {
        throw new Error('Method not implemented.');
    }

    /**
     * @override
     */
    public clean(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
