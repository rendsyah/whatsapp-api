/// Import Modules
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// Import Entity
import { Users } from './users.entity';

@Entity()
export class Access {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Users, (users) => users.access)
    users: Users[];

    @Column({ type: 'varchar', length: 100 })
    role: string;

    @Column({ type: 'smallint', default: 1, comment: '0 -> inactive, 1 -> active' })
    status: number;

    @Column({ type: 'smallint', default: 0, comment: '0 -> not deleted, 1 -> deleted' })
    is_deleted: number;

    @Column({ default: null, nullable: true })
    created_by: number;

    @ManyToOne(() => Users, (users) => users.accessCreated)
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
    createdBy: Users;

    @Column({ default: null, nullable: true })
    updated_by: number;

    @ManyToOne(() => Users, (users) => users.accessUpdated)
    @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
    updatedBy: Users;

    @Column({ default: null, nullable: true })
    deleted_by: number;

    @ManyToOne(() => Users, (users) => users.accessDeleted)
    @JoinColumn({ name: 'deleted_by', referencedColumnName: 'id' })
    deletedBy: Users;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NULL', nullable: true })
    deleted_at: Date;
}
