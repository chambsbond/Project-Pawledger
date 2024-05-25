const { data } = await Functions.makeHttpRequest({
  url: `https://swapi.dev/api/people/1`,
});

return Functions.encodeString(data.name);