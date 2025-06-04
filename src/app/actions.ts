"use server";

import { getAccessToken } from "@/lib/soundcloud";


//action to get the stream object from the soundcloud api
export async function getStream(trackId: string) : Promise<string | null> {
    //Get the stream object from
    /*
    $ curl -X GET "https://api.soundcloud.com/tracks/TRACK_ID/stream" \
         -H  "accept: application/json; charset=utf-8" \
         -H "Authorization: OAuth ACCESS_TOKEN"
    */
   const accessToken = await getAccessToken();
   console.log('accessToken', accessToken);
   
   const response = await fetch(`https://api.soundcloud.com/tracks/${trackId}/stream`, {
    headers: {
        'Accept': 'application/json; charset=utf-8',
        'Authorization': `OAuth ${accessToken}`,
      },
   });
   
   if (!response.ok) {
     throw new Error(`Failed to get stream: ${response.status} ${response.statusText}`);
   }
   
   console.log('stream response', response);
   // Return the direct MP3 URL instead of the stream
   return response.url;
}