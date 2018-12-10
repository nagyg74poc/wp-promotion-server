import * as objectMapper from 'object-mapper';

export class ObjectMapper {
    public static merge<T>(object: any, destObject: any, mapper: any): T {
        return object ? objectMapper(object, destObject, mapper) : null;
    }
    public static map<T>(object: any, mapper: any): T {
        return object ? objectMapper(object, mapper) : null;
    }

    public static mapTo<T>(fromObject: any, toObject: T, mapper: any): T {
        return fromObject ? objectMapper(fromObject, toObject, mapper) : null;
    }

    public static mapPromise<T>(promise: Promise<any>, mapper: any): Promise<T> {
        return promise.then(result => {
            return new Promise<T>(resolve => {
                resolve(ObjectMapper.map<T>(result, mapper));
            });
        });
    }

    public static mapArrayPromise<T>(promise: Promise<any>, mapper: any): Promise<T[]> {
        return promise.then(result => {
            return new Promise<T[]>(resolve => {
                resolve(ObjectMapper.mapArray<T>(result, mapper));
            });
        });
    }

    public static mapArray<T>(objects: any[], mapper: any): T[] {
        return objects ? objects.map(object => ObjectMapper.map<T>(object, mapper)) : [];
    }
}
