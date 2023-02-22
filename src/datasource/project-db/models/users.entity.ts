import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class Users {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 100 })
    username: string;

    @Column({ type: 'varchar', length: 100 })
    password: string;

    @Column({ type: 'smallint', default: 1 })
    status: number;

    @Column({ type: 'timestamp', default: Timestamp, select: false })
    created_at: Date;

    @Column({ type: 'timestamp', default: Timestamp, select: false })
    updated_at: Date;
}
