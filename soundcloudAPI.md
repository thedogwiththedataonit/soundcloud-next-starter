Client Credentials Token Exchange Flow
With applications, such as CLIs, or pure back-end services, you would authenticate the application itself rather than a user. For instance, you might want to build an artist's website where you only need an access to their tracks, playlists, or user information. There is no need to go through the connect flow, as SoundCloud API provides the Client Credentials Flow for these purposes. You pass along the client_id and client_secret you have acquired at registration to authenticate and get a token.

Curl
# obtain the access token

$ curl -X POST "https://secure.soundcloud.com/oauth/token" \
     -H  "accept: application/json; charset=utf-8" \
     -H  "Content-Type: application/x-www-form-urlencoded" \
     -H  "Authorization: Basic Base64(client_id:client_secret)" \
     --data-urlencode "grant_type=client_credentials"

# If your client_id is "my_client_id" and client_secret is "my_client_secret"
# The concatenated string would be "my_client_id:my_client_secret"
# The Base64 encoded string of "my_client_id:my_client_secret" is "bXlfY2xpZW50X2lkOm15X2NsaWVudF9zZWNyZXQ="
*** Developers migrating to new endpoints should note that for the client_credential grant type, ONLY basic header client authentication is supported. Client credentials as request content has been dropped.

Similarly to the Authorization Code flow, you receive an object that has an access_token, refresh_token properties as well as expires_in and scope. Store the object in a database or a data storage of your choice. Associate it with the user it belongs to and use the access_token for requesting data from our API. Use the refresh_token to automatically renew the expired token.

Please be aware there is rate limiting on the amount of tokens you can request through the Client Credentials Flow: 50 tokens in 12h per app, and 30 tokens in 1h per IP address. In order to not hit the limit we highly recommend reusing one token between instances of your service and implementing the Refresh Token flow to renew tokens.

Note: Currently, all clients are treated as confidential rather than public, meaning that a secret is required to obtain a token.

Refreshing Tokens
As the access tokens expire you will need to periodically refresh them. Currently a token lives around 1 hour. You can set an automatic process that checks the expiration time of a current token and updates it using the provided refresh_token. Each refresh token can only be used once.

Note: Currently, all clients are treated as confidential rather than public, meaning that a secret is required to obtain a token.

Curl
# refresh token

$ curl -X POST "https://secure.soundcloud.com/oauth/token" \
     -H  "accept: application/json; charset=utf-8" \
     -H  "Content-Type: application/x-www-form-urlencoded" \
     --data-urlencode "grant_type=refresh_token" \
     --data-urlencode "client_id=YOUR_CLIENT_ID" \
     --data-urlencode "client_secret=YOUR_CLIENT_SECRET" \
     --data-urlencode "refresh_token=YOUR_TOKEN" \

Search https://developers.soundcloud.com/docs/api/explorer/open-api#/search/get_tracks
This section presumes you have:

Registered your App
Resources such as tracks, users, playlists can be searched using our API. Most endpoints will accept a q param which you can use to specify a keyword to search for in fields like title, username, description, etc. depending on the resource type.

Curl
# search pnly for playable tracks
$ curl -X GET "https://api.soundcloud.com/tracks?q=hello&ids=1,2,3&genres=Pop,House&access=playable&limit=3&linked_partitioning=true" \
       -H  "accept: application/json; charset=utf-8" \
       -H "Authorization: OAuth ACCESS_TOKEN"
You can also specify ranges for bpm, duration, and more.

Curl
# search pnly for playable tracks
$ curl -X GET "https://api.soundcloud.com/tracks?q=hello&ids=1,2,3&genres=Pop,House&bpm%5Bfrom%5D=120&duration%5Bfrom%5D=30000&access=playable&limit=3&linked_partitioning=true" \
       -H  "accept: application/json; charset=utf-8" \
       -H "Authorization: OAuth ACCESS_TOKEN"
For a complete list of search fields and filters, please check the /search section for the resource type you'd like to search.

Pagination
This section presumes you have:

Registered your App
Most results from our API are returned as a collection. The number of items in the collection returned is limited to 50 by default with a maximum value of 200. Most endpoints support a linked_partitioning parameter that allows you to page through collections. When this parameter is passed, the response will contain a next_href property if there are additional results. To fetch the next page of results, simply follow that URI. If the response does not contain a next_href property, you have reached the end of the results.

Curl
# fetch first 25 user's playlists
$ curl -X GET "https://api.soundcloud.com/me/playlists?show_tracks=false&linked_partitioning=true&limit=25" \
       -H  "accept: application/json; charset=utf-8" \
       -H "Authorization: OAuth ACCESS_TOKEN"

# response contains 'next_href': "https://api.soundcloud.com/playlists?show_tracks=false&page_size=25&cursor=1234567"