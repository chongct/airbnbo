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

const newVoteHome = {
  subscribe: (parent, args, ctx, info) => {
    // console.log("--------test vote subscription-----------")
    return ctx.db.subscription.voteHome(
      { },
      info
    )
  }
}

module.exports = {
  newLink,
  newVote,
  newHome,
  newVoteHome
}
