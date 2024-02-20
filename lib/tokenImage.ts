export async function getAssetUrl(assetAddress: string) {
  try {
    const response = await fetch('https://wnr1c6qx6jcz9qde.public.blob.vercel-storage.com/data/tokenImageURI.json');
    const data = await response.json();
    const evmosTokens = data.evmos
    console.log(evmosTokens[assetAddress])
    return evmosTokens[assetAddress];
  } catch (error) {
    console.error(error);
  }
}


