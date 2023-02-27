/// Import Modules
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// Import Entity
import { ModelsBaseEntity } from './models_base.entity';
import { Users } from './users.entity';

@Entity()
export class MasterAccess extends ModelsBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Users, (users) => users.access)
    users: Users[];

    @Column({ type: 'varchar', length: 100 })
    role: string;
}
