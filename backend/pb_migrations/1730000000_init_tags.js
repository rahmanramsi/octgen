/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = new Collection({
      name: "tags",
      type: "base",
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          min: 1,
          max: 50,
        },
        {
          name: "slug",
          type: "text",
          required: true,
          min: 1,
          max: 50,
          pattern: "^[a-z0-9-]+$",
        },
        {
          name: "created",
          type: "autodate",
          onCreate: true,
        },
        {
          name: "updated",
          type: "autodate",
          onCreate: true,
          onUpdate: true,
        },
      ],
      indexes: [
        "CREATE UNIQUE INDEX `idx_tags_name` ON `tags` (`name`)",
        "CREATE UNIQUE INDEX `idx_tags_slug` ON `tags` (`slug`)",
      ],
    });

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("tags");
    return app.delete(collection);
  },
);
