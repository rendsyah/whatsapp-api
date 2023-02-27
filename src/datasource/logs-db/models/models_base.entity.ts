// Import Modules
import { Prop } from '@nestjs/mongoose';

// Define Models Base Entity
export abstract class ModelsBaseEntity {
    @Prop({ default: 1 })
    status: number;

    @Prop({ default: 0 })
    isDeleted: number;

    @Prop({ default: null })
    deletedAt: string;
}
