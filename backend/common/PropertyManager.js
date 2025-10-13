"use strict";

// DEPENDENCIES
// ------------
// External
import nodePropertyLoader from "properties";
// Local
import Logger from "./Logger.js";
import util from "./util.js";


// CONSTANTS
// ---------
const CLASS_NAME = "PropertyManager";

// Assorted, base properties
const DEFAULT_FRONTEND_PORT = 10800;
const DEFAULT_BACKEND_PORT = 10801;
const DEFAULT_REQUEST_TIMEOUT_IN_SECONDS = 5;
const DEFAULT_NAME = "Anonymous";
const DEFAULT_MAX_ART_SIZE = 512;
const DEFAULT_REFRESH_FREQUENCY_IN_MINUTES = 1;
const DEFAULT_SITE_TITLE = "Shelf"
const DEFAULT_URL = "http://localhost";
const DEFAULT_TWITTER_HANDLE = "";
const DEFAULT_USER_AGENT_BASE = "Shelf/2.0 +https://github.com/barrowclift/shelf";

// Mongo
const DEFAULT_MONGO_DBNAME = "shelfDb";
const DEFAULT_MONGO_HOST = "0.0.0.0";
const DEFAULT_MONGO_PORT = 27017;

// Records
const DEFAULT_RECORD_SHELF_ENABLED = true;
const DEFAULT_DISCOGS_USER_ID = null;
const DEFAULT_DISCOGS_USER_TOKEN = null;

// Books
const DEFAULT_BOOK_SHELF_ENABLED = true;
const DEFAULT_GOODREADS_USER_ID = null;
const DEFAULT_GOODREADS_KEY = null;
const DEFAULT_GOODREADS_TOKEN = null;
const DEFAULT_EXPERIMENTAL_BOX_RENDERING = false;

// Board Games
const DEFAULT_BOARD_GAME_SHELF_ENABLED = true;
const DEFAULT_BOARD_GAME_GEEK_USER_ID = null;


// GLOBALS
// -------
let log = new Logger(CLASS_NAME);


/**
 * Working with properties is a pain. You have to check for existance, have
 * default values defined, etc. This detracts from what the code using those
 * values actually wants: a sane default if not present, no boilerplate hiding
 * the core of their own logic.
 *
 * Thus, any and ALL Shelf properties are pre-loaded and validated here, and
 * if not provided or present fall back to sane defaults. Thus, letting
 * calling code get back to what's *actually* important to them: their own
 * work.
 */
export default class PropertyManager {

    /**
     * Does not automatically load any properties file, but simply initializes
     * all Shelf properties to their default values. To load
     * `shelf.properties`, call load().
     */
    constructor() {
        // Assorted, base properties
        this.requestTimeoutInMillis = util.secondsToMillis(DEFAULT_REQUEST_TIMEOUT_IN_SECONDS);
        this.name = DEFAULT_NAME;
        this.maxArtSize = DEFAULT_MAX_ART_SIZE;
        this.refreshFrequencyInMillis = util.minutesToMillis(DEFAULT_REFRESH_FREQUENCY_IN_MINUTES);
        this.title = DEFAULT_SITE_TITLE;
        this.twitterHandle = DEFAULT_TWITTER_HANDLE;
        this.frontendUrl = DEFAULT_URL;
        this.frontendPort = DEFAULT_FRONTEND_PORT;
        this.backendUrl = DEFAULT_URL;
        this.backendPort = DEFAULT_BACKEND_PORT;
        this.publicUrl = DEFAULT_URL;
        this.userAgentBase = DEFAULT_USER_AGENT_BASE;

        // Mongo
        this.mongoHost = DEFAULT_MONGO_HOST;
        this.mongoDbName = DEFAULT_MONGO_DBNAME;
        this.mongoPort = DEFAULT_MONGO_PORT;

        // Records
        this.recordShelfEnabled = DEFAULT_RECORD_SHELF_ENABLED;
        this.discogsUserId = DEFAULT_DISCOGS_USER_ID;
        this.discogsUserToken = DEFAULT_DISCOGS_USER_TOKEN;

        // Books
        this.bookShelfEnabled = DEFAULT_BOOK_SHELF_ENABLED;
        this.goodreadsUserId = DEFAULT_GOODREADS_USER_ID;
        this.goodreadsKey = DEFAULT_GOODREADS_KEY;
        this.goodreadsToken = DEFAULT_GOODREADS_TOKEN;

        // Board Games
        this.boardGameShelfEnabled = DEFAULT_BOARD_GAME_SHELF_ENABLED;
        this.boardGameGeekUserId = DEFAULT_BOARD_GAME_GEEK_USER_ID;
        this.experimentalBoardGameBoxRendering = DEFAULT_EXPERIMENTAL_BOX_RENDERING;
    }

    /**
     * ==============
     * PUBLIC METHODS
     * ==============
     */

    async load(filename) {
        if (!filename) {
            throw "Property filename is null";
        }

        let properties = await this._load(filename);

        // Assorted, base properties
        // Environment variables take precedence over properties file

        if (process.env.REQUEST_TIMEOUT_IN_SECONDS) {
            this.requestTimeoutInMillis = util.secondsToMillis(parseInt(process.env.REQUEST_TIMEOUT_IN_SECONDS));
        } else if ("request.timeout.in.seconds" in properties) {
            let requestTimeoutInSeconds = properties["request.timeout.in.seconds"];
            this.requestTimeoutInMillis = util.secondsToMillis(requestTimeoutInSeconds);
        }

        if (process.env.MAX_ART_SIZE) {
            this.maxArtSize = parseInt(process.env.MAX_ART_SIZE);
        } else if ("max.art.size" in properties) {
            this.maxArtSize = properties["max.art.size"];
        }

        if (process.env.SHELF_NAME) {
            this.name = process.env.SHELF_NAME;
        } else if ("name" in properties) {
            this.name = properties["name"];
        }

        if (process.env.REFRESH_FREQUENCY_IN_MINUTES) {
            let refreshFrequencyInMinutes = parseInt(process.env.REFRESH_FREQUENCY_IN_MINUTES);
            this.refreshFrequencyInMillis = util.minutesToMillis(refreshFrequencyInMinutes);
        } else if ("refresh.frequency.in.minutes" in properties) {
            let refreshFrequencyInMinutes = properties["refresh.frequency.in.minutes"];
            this.refreshFrequencyInMillis = util.minutesToMillis(refreshFrequencyInMinutes);
        }

        if (process.env.SITE_TITLE) {
            this.title = process.env.SITE_TITLE;
        } else if ("site.title" in properties) {
            this.title = properties["site.title"];
        }

        if (process.env.PUBLIC_URL) {
            this.publicUrl = process.env.PUBLIC_URL;
        } else if ("public.url" in properties) {
            this.publicUrl = properties["public.url"];
        }

        if (process.env.FRONTEND_URL) {
            this.frontendUrl = process.env.FRONTEND_URL;
        } else if ("frontend.url" in properties) {
            this.frontendUrl = properties["frontend.url"];
        }

        if (process.env.FRONTEND_PORT) {
            this.frontendPort = process.env.FRONTEND_PORT;
        } else if ("frontend.port" in properties) {
            this.frontendPort = properties["frontend.port"];
        }

        if (process.env.BACKEND_URL) {
            this.backendUrl = process.env.BACKEND_URL;
        } else if ("backend.url" in properties) {
            this.backendUrl = properties["backend.url"];
        }

        if (process.env.BACKEND_PORT) {
            this.backendPort = process.env.BACKEND_PORT;
        } else if ("backend.port" in properties) {
            this.backendPort = properties["backend.port"];
        }

        if (process.env.SHELF_TWITTER_HANDLE) {
            this.twitterHandle = process.env.SHELF_TWITTER_HANDLE;
        } else if ("twitter.handle" in properties) {
            this.twitterHandle = properties["twitter.handle"];
        }

        if (process.env.USER_AGENT_BASE) {
            this.userAgentBase = process.env.USER_AGENT_BASE;
        } else if ("user.agent.base" in properties) {
            this.userAgentBase = properties["user.agent.base"];
        }

        // Mongo
        // Environment variables take precedence

        if (process.env.MONGODB_HOST) {
            this.mongoHost = process.env.MONGODB_HOST;
        } else if ("mongodb.host" in properties) {
            this.mongoHost = properties["mongodb.host"];
        }

        if (process.env.MONGODB_NAME) {
            this.mongoDbName = process.env.MONGODB_NAME;
        } else if ("mongodb.name" in properties) {
            this.mongoDbName = properties["mongodb.name"];
        }

        if (process.env.MONGODB_PORT) {
            this.mongoPort = process.env.MONGODB_PORT;
        } else if ("mongodb.port" in properties) {
            this.mongoPort = properties["mongodb.port"];
        }

        if (process.env.MONGODB_COLLECTION_RECORDS_NAME) {
            this.recordsCollectionName = process.env.MONGODB_COLLECTION_RECORDS_NAME;
        } else if ("mongodb.collection.records.name" in properties) {
            this.recordsCollectionName = properties["mongodb.collection.records.name"];
        }

        if (process.env.MONGODB_COLLECTION_BOARDGAMES_NAME) {
            this.boardGamesCollectionName = process.env.MONGODB_COLLECTION_BOARDGAMES_NAME;
        } else if ("mongodb.collection.boardGames.name" in properties) {
            this.boardGamesCollectionName = properties["mongodb.collection.boardGames.name"];
        }

        if (process.env.MONGODB_COLLECTION_BOOKS_NAME) {
            this.booksCollectionName = process.env.MONGODB_COLLECTION_BOOKS_NAME;
        } else if ("mongodb.collection.books.name" in properties) {
            this.booksCollectionName = properties["mongodb.collection.books.name"];
        }

        // Records
        // Environment variables take precedence

        if (process.env.RECORD_SHELF_ENABLED !== undefined) {
            this.recordShelfEnabled = process.env.RECORD_SHELF_ENABLED === 'true';
        } else if ("record.shelf.enabled" in properties) {
            this.recordShelfEnabled = properties["record.shelf.enabled"];
        }

        if (process.env.DISCOGS_USER_ID) {
            this.discogsUserId = process.env.DISCOGS_USER_ID;
        } else if ("discogs.user.id" in properties) {
            this.discogsUserId = properties["discogs.user.id"];
        }

        if (process.env.DISCOGS_USER_TOKEN) {
            this.discogsUserToken = process.env.DISCOGS_USER_TOKEN;
        } else if ("discogs.user.token" in properties) {
            this.discogsUserToken = properties["discogs.user.token"];
        }

        // Books
        // Environment variables take precedence

        if (process.env.BOOK_SHELF_ENABLED !== undefined) {
            this.bookShelfEnabled = process.env.BOOK_SHELF_ENABLED === 'true';
        } else if ("book.shelf.enabled" in properties) {
            this.bookShelfEnabled = properties["book.shelf.enabled"];
        }

        if (process.env.GOODREADS_USER_ID) {
            this.goodreadsUserId = process.env.GOODREADS_USER_ID;
        } else if ("goodreads.user.id" in properties) {
            this.goodreadsUserId = properties["goodreads.user.id"];
        }

        if (process.env.GOODREADS_USER_KEY) {
            this.goodreadsKey = process.env.GOODREADS_USER_KEY;
        } else if ("goodreads.user.key" in properties) {
            this.goodreadsKey = properties["goodreads.user.key"];
        }

        if (process.env.GOODREADS_USER_TOKEN) {
            this.goodreadsToken = process.env.GOODREADS_USER_TOKEN;
        } else if ("goodreads.user.token" in properties) {
            this.goodreadsToken = properties["goodreads.user.token"];
        }

        // Board Games
        // Environment variables take precedence

        if (process.env.BOARDGAME_SHELF_ENABLED !== undefined) {
            this.boardGameShelfEnabled = process.env.BOARDGAME_SHELF_ENABLED === 'true';
        } else if ("boardgame.shelf.enabled" in properties) {
            this.boardGameShelfEnabled = properties["boardgame.shelf.enabled"];
        }

        if (process.env.BOARDGAMEGEEK_USER_ID) {
            this.boardGameGeekUserId = process.env.BOARDGAMEGEEK_USER_ID;
        } else if ("boardgamegeek.user.id" in properties) {
            this.boardGameGeekUserId = properties["boardgamegeek.user.id"];
        }

        if (process.env.EXPERIMENTAL_BOARDGAME_BOX_RENDERING !== undefined) {
            this.experimentalBoardGameBoxRendering = process.env.EXPERIMENTAL_BOARDGAME_BOX_RENDERING === 'true';
        } else if ("experimental.boardgame.box.rendering" in properties) {
            this.experimentalBoardGameBoxRendering = properties["experimental.boardgame.box.rendering"];
        }

        this.backendUrl = this.backendUrl + ":" + this.backendPort;
        this.frontendUrl = this.frontendUrl + ":" + this.frontendPort;
    }

    /**
     * ===============
     * PRIVATE METHODS
     * ===============
     */

    async _load(filename) {
        // The properties package does not currently support promises natively
        return new Promise((resolve, reject) => {
            nodePropertyLoader.parse(filename,
                                     { path: true },
                                     function(error, properties) {
                if (error) {
                    log.error("loadProperties", "An error occurred while loading properties");
                    reject(Error(error));
                } else {
                    log.info("Loaded properties");
                    resolve(properties);
                }
            });
        });
    }

}
