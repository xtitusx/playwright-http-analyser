import { HttpAnalyser } from '../http-analyser';
import { Serializer } from './serializer';

export class MongoDbSerializer extends Serializer {
    constructor(httpAnalyser: HttpAnalyser) {
        super(httpAnalyser);
    }

    /**
     * @override
     */
    public serialize(): void {
        throw new Error('Method not implemented.');
    }

    /**
     * @override
     */
    public clean(): void {
        throw new Error('Method not implemented.');
    }
}
