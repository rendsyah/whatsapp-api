/// Import Modules
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// Import Entity
import { Users } from './users.entity';

@Entity()
export class MasterAccess {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Users, (users) => users.access)
    users: Users[];

    @Column({ type: 'varchar', length: 100 })
    role: string;

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
