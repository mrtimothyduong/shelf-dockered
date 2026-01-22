<h1><img height="25" src="https://raw.githubusercontent.com/barrowclift/shelf/master/frontend/static/images/logo/logo.png" /> Shelf</h1>

# Shelf-dockered Setup

## Installation - Docker Deployment

1. Create a new `compose.yaml` file and copy the contents from the docker-compose.yml in this repo
2. Create a new `.env` file in the same directory, use the .env.template in this repo and update the necessary fields
3. Run `docker compose pull && docker compose up -d`
4. Open the site on `http:\\ip-address:10800` (unless you changed the front-port in the compose.yaml)

## Docker Architecture
`Shelf-dockered` uses a initiating script to map the environmental variables in the docker `compose.yaml` file into the shelf deployment. This makes merges simple when main branch updates. 

> [!NOTE] 
> The following readme.md below is from the Barrowclift's readme.md

# Shelf

### Beautifully display your library on the Internet

<picture>
  <source type="image/webp" srcset="https://cargo.barrowclift.me/projects/code/shelf/shelf-promo.webp">
  <img type="image/jpeg" alt="Promotional screenshots of Shelf, demonstrating both Light and Dark Mode" title="Promotional screenshots of Shelf, demonstrating both Light and Dark Mode" src="https://cargo.barrowclift.me/projects/code/shelf/shelf-promo.jpg">
</picture>

# FAQ

## Why use shelf?

Browsing a friend's library is a delightful way to gain insight into their taste and life experiences. There's nothing quite like bonding over shared favorites or laughing over guilty pleasures while sifting through someone else's library of music and board games. However, I often wished my library could be presented digitally to expand these experiences beyond their physical confines, allowing me to share and discuss with new friends on the go or even curious individuals on the internet.

## Doesn’t Discogs & BoardGameGeek already do this?

You're absolutely right, [Discogs](https://www.discogs.com) and [BoardGameGeek](https://boardgamegeek.com) already have this functionality. However these experiences are suboptimal in a few key areas: [Discogs](https://www.discogs.com) and [BoardGameGeek](https://boardgamegeek.com) are cumbersome to navigate, and tend too close towards [utilitarian and brutalist](https://en.wikipedia.org/wiki/Brutalist_architecture) in their design for my taste. Not to mention—by nature of these services being separate entities—your library becomes unnaturally siphoned across numerous platforms, which makes sharing your whole library cumbersome (better remember how to find your account if you're sharing on a device other than your own!)

Shelf addresses these shortcomings; since these services shoulder the burden of maintaining your library *data*, Shelf is free to instead focus on the *presentation*, the "form" that these services either chose not to or failed to address. In this way, Shelf is **not** a [Discogs](https://www.discogs.com) or [BoardGameGeek](https://boardgamegeek.com) replacement, rather it's an optional supplement.

## How does Shelf handle different issues of the same entity?

Each of Shelf's data sources already perfectly serve categorizing reissues, remasters, and other such editions, and is thus not Shelf's focus. Shelf is about the music and board games themselves, not the nitty gritty details about particular issues. Thus, Shelf consolidates "duplicates" into just a single abstraction of the thing itself. For example, if you have an original 1966 pressing of *Pet Sounds* by The Beach Boys as well as [Analogue Production's 2015 remaster](https://store.acousticsounds.com/d/95586/The_Beach_Boys-Pet_Sounds-200_Gram_Vinyl_Record), Shelf will instead just display one "Pet Sounds" record to represent you own *Pet Sounds*, since both pressings are "the same" album. The same applies for board games.

## How do I add my library to Shelf?

Since [Discogs](https://www.discogs.com) and [BoardGameGeek](https://boardgamegeek.com) are arguably the most popular services for their respective media, odds are you already have accounts and collections maintained in these services. Asking people to meticulously add their entire library to a whole new service alongside those existing ones is a non-starter (especially since Shelf only needs a minor subset of the data freely available in these services). Thus, Shelf instead stays in sync with your accounts in these services; anything you add or remove there will automatically be reflected in Shelf. Shelf only maintains a local [MongoDB](https://www.mongodb.com) cache of some trimmed-down data from these services, no data is actually entered into Shelf by the user themselves.

## How do I sync my Discogs account with Shelf to display my records?

You will need to make the following changes to Shelf's properties file at `backend/resources/shelf.properties`:

1. Set your Discogs username in `discogs.user.id`.
2. You'll need to generate a [Discogs](https://www.discogs.com) personal access token, which you can do at [the following link](https://www.discogs.com/settings/developers). Copy and paste that token in `discogs.user.token`.

Note that only records in your collection will be fetched for your Shelf collection. Records intended to show in your Shelf wishlist should instead be present only in your Discogs wishlist.

## How do I sync my BoardGameGeek account with Shelf to display my games?

You will need to make the following changes to Shelf's properties file at `backend/resources/shelf.properties`:

1. Set your [BoardGameGeek](https://boardgamegeek.com) username in `boardgamegeek.user.id`.

Note that only board games both in your collection and the "Own" checkbox checked will be fetched for your Shelf collection. Board games intended to show in your Shelf wishlist must also be in your collection but with the "Wishlist" checkbox checked.
