async function feed(parent, args, ctx, info) {
  const { filter, first, skip, orderBy } = args // destructure input arguments
  const where = filter
    ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
    : {}

  const allLinks = await ctx.db.query.links({})
  const count = allLinks.length
  // console.log(args)

  const queriedLinkes = await ctx.db.query.links({ first, skip, where, orderBy })

  console.log(ctx.db.query)

  return {
    linkIds: queriedLinkes.map(link => link.id),
    count
  }
}

// async function homes(, _, ctx) {
//   const homes = await ctx.db.query.homes({})
//   return homes
// }

async function homeslist(parent, args, ctx, info) {
  // edit schema.graphql too
  // edit field to search for under _contains too
  const { filter, first, skip, orderBy } = args // destructure input arguments
  const where = filter
  ? { OR: [{ id_contains: filter }, { title_contains: filter }] }
  : {}

  const homes = await ctx.db.query.homes({})
  const count = homes.length
  // console.log(args)

  const queriedHomes = await ctx.db.query.homes({ first, skip, where, orderBy })
  console.log(ctx.db.query)

  return {
    homeIds: queriedHomes.map(home => home.id),
    count
  }
}

module.exports = {
  feed,
  homeslist
}
