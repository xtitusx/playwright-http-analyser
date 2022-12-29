import { Tyr } from '@xtitusx/type-guard';

import { Serializer } from './serializer';
import { SerializerType } from './serializer-type.enum';
import { JsonSerializer } from './json.serializer';
import { MongoDbSerializer } from './mongodb.serializer';

export class SerializerFactory {
    private static INSTANCE: SerializerFactory;

    private constructor() {}

    public static getInstance(): SerializerFactory {
        if (!SerializerFactory.INSTANCE) {
            SerializerFactory.INSTANCE = new SerializerFactory();
        }

        return SerializerFactory.INSTANCE;
    }

    /**
     * @param serializerType
     * @throws {RangeError} If serializerType value is not correctly set.
     */
    public create(serializerType: SerializerType): Serializer {
        let serializer: Serializer;

        const guardResult = Tyr.string().isIn(Object.values(SerializerType)).guard(serializerType);

        if (!guardResult.isSuccess()) {
            throw new RangeError(guardResult.getMessage());
        }

        switch (serializerType) {
            case SerializerType.JSON: {
                serializer = new JsonSerializer();
                break;
            }
            case SerializerType.MONGODB: {
                serializer = new MongoDbSerializer();
                break;
            }
        }

        return serializer;
    }
}
