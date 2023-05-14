// Import Modules
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// Import Entity
import { Access } from './access.entity';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null, nullable: true })
    access_id: number;

    @ManyToOne(() => Access, (access) => access.users)
    @JoinColumn({ name: 'access_id', referencedColumnName: 'id' })
    access: Access;

    @OneToMany(() => Access, (access) => access.createdBy)
    accessCreated: Access[];

    @OneToMany(() => Access, (access) => access.updatedBy)
    accessUpdated: Access[];

    @OneToMany(() => Access, (access) => access.deletedBy)
    accessDeleted: Access[];

    @Column({ unique: true, type: 'varchar', length: 100 })
    username: string;

    @Column({ type: 'varchar', length: 100 })
    password: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'smallint', default: 1, comment: '0 -> inactive, 1 -> active' })
    status: number;

    @Column({ type: 'smallint', default: 0, comment: '0 -> not deleted, 1 -> deleted' })
    is_deleted: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NULL', nullable: true })
    deleted_at: Date;
}
