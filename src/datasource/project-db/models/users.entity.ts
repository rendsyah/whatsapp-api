// Import Modules
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// Import Entity
import { MasterAccess } from './master_access.entity';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MasterAccess, (access) => access.users)
    @JoinColumn({ name: 'access_id' })
    access: MasterAccess;

    @Column({ unique: true, type: 'varchar', length: 100 })
    username: string;

    @Column({ type: 'varchar', length: 100 })
    password: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, default: null, nullable: true })
    hash_token: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    register_at: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NULL', nullable: true })
    login_at: string;

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
