// Import Modules
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Define Models Base Entity
export abstract class ModelsBaseEntity {
    @Column({ type: 'smallint', default: 1 })
    status: number;

    @Column({ type: 'smallint', default: 0 })
    is_deleted: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NULL', nullable: true })
    deleted_at: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;
}
