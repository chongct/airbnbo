const newLink = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.link(
      // https://github.com/graphcool/prisma/issues/1734
      // { where: { mutation_in: ['CREATED'] } },
      { },
      info,
    )
  },
}

const newVote = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.vote(
      // https://github.com/graphcool/prisma/issues/1734
      // { where: { mutation_in: ['CREATED'] } },
      { },
      info,
    )
  },
}

const newHome = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.home(
      { },
      info
    )
  }
}

module.exports = {
  newLink,
  newVote,
  newHome
}
