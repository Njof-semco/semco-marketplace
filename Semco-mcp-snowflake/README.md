# semco-snowflake (not listed in the marketplace yet)

Snowflake-managed MCP server for `semco-dataandanalytics`. Not usable until a Snowflake admin has:

1. Created the MCP server object: `CREATE MCP SERVER <name> FROM SPECIFICATION ...` in a database and schema.
2. Created an OAuth security integration (`TYPE = OAUTH`, `OAUTH_CLIENT = CUSTOM`, `OAUTH_CLIENT_TYPE = 'PUBLIC'`) and shared its client ID. Snowflake does not support dynamic client registration, so the client ID is required.

Then replace `<DATABASE>`, `<SCHEMA>`, `<SERVER_NAME>` and `<CLIENT_ID>` in `.mcp.json` and add the plugin to `.claude-plugin/marketplace.json`.

Sign in: `/mcp` or `claude mcp login`, then Entra ID SSO in the browser.
