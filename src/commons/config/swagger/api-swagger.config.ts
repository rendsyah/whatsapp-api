// Import Modules
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

// Define Api Swagger Config
export const apiSwaggerConfig = (app: INestApplication): OpenAPIObject => {
    const setDocumentApi = new DocumentBuilder()
        .setTitle('SERVICE API')
        .setDescription('SERVICE API documentation')
        .setTermsOfService('http://example.com/terms')
        .setContact('Developer', 'http://www.example.com/support', 'example@gmail.com')
        .setVersion('1.0')
        .setLicense('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0.html')
        .addSecurity('authentication', { name: 'authentication', type: 'apiKey', in: 'header' })
        .build();

    const optionsApi: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    };

    return SwaggerModule.createDocument(app, setDocumentApi, optionsApi);
};