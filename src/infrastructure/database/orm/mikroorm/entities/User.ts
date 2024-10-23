import { Entity, PrimaryKey, Property, t } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey({ type: t.uuid, nullable: false })
  id: string = v4();

  @Property({ type: t.string, nullable: false })
  firstName!: string;

  @Property({ type: t.string, nullable: false })
  lastName!: string;

  @Property({ type: t.json, defaultRaw: "'{}'", nullable: false })
  meta!: Record<string, any>;

  @Property({ type: t.datetime, defaultRaw: 'NOW()', nullable: false })
  createdAt!: Date;

  @Property({ type: t.datetime, defaultRaw: 'NOW()', nullable: false })
  updatedAt!: Date;
}
