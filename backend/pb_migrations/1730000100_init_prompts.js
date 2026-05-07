/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const tagsCollection = app.findCollectionByNameOrId("tags");

    const collection = new Collection({
      name: "prompts",
      type: "base",
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          min: 1,
          max: 200,
        },
        {
          name: "slug",
          type: "text",
          required: true,
          min: 1,
          max: 200,
          pattern: "^[a-z0-9-]+$",
        },
        {
          name: "body",
          type: "text",
          required: true,
          min: 1,
          max: 5000,
        },
        {
          name: "description",
          type: "text",
          required: false,
          max: 500,
        },
        {
          name: "tags",
          type: "relation",
          required: false,
          collectionId: tagsCollection.id,
          cascadeDelete: false,
          minSelect: 0,
          maxSelect: 10,
        },
        {
          name: "images",
          type: "file",
          required: false,
          maxSelect: 8,
          maxSize: 5242880,
          mimeTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
          ],
          thumbs: ["400x400", "800x0"],
        },
        {
          name: "featured",
          type: "bool",
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
        "CREATE UNIQUE INDEX `idx_prompts_slug` ON `prompts` (`slug`)",
        "CREATE INDEX `idx_prompts_featured` ON `prompts` (`featured`)",
        "CREATE INDEX `idx_prompts_created` ON `prompts` (`created`)",
      ],
    });

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("prompts");
    return app.delete(collection);
  },
);
