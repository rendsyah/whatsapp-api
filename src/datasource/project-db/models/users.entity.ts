// Import Modules
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Import Entity
import { ModelsBaseEntity } from './models_base.entity';
import { MasterAccess } from './master_access.entity';

@Entity()
export class Users extends ModelsBaseEntity {
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

    @CreateDateColumn({ type: 'timestamp', default: () => 'NULL', nullable: true })
    register_at: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NULL', nullable: true })
    login_at: string;
}
