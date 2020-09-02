import { createConnection, getConnection } from "typeorm";
import { DbConnectionError } from "../handlers/error-handling";
import * as t1 from "../../models/user";
import "reflect-metadata";
import AWS from "aws-sdk";

export async function auroraConnectApi(): Promise<any> {
    try {
        try {
            const connection = getConnection();
            return connection;
        } 
        catch(e) {
            const cf = new AWS.CloudFormation({ region: process.env.REGION });
            const listExports = await cf.listExports().promise();
            const dbSecretARN = listExports.Exports.filter((item) => { return item.Name === process.env.DB_SECRET_ARN_EXPORT_NAME });
            const resourceSecretARN = listExports.Exports.filter((item) => { return item.Name === process.env.DB_CLUSTER_ARN_EXPORT_NAME });

            const connection = await createConnection({
                type: 'aurora-data-api',
                name: 'default',
                database: process.env.DB_NAME,
                secretArn:dbSecretARN[0].Value,
                resourceArn: resourceSecretARN[0].Value,
                region: process.env.REGION,
                entities: [
                    t1.User
                ],
                synchronize: true,
                logging: false
            });

            return connection;
                  }
    } 
    catch (e) {
        console.error('Aurroa API Connect Error: Generally this is cause by Aoura Auto Pause. Just restart the app!');
        throw new DbConnectionError('Aurroa API Connect Error: Generally this is cause by Aoura Auto Pause. Just restart the app!');
    }
}
