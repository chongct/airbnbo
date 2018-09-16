const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, { url, description }, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.mutation.createLink({ data: { url, description, postedBy: { connect: { id: userId } } } }, info)
}

async function signup(parent, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password },
  })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, ctx, info) {
  const user = await ctx.db.query.user({ where: { email: args.email } })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

async function vote(parent, args, ctx, info) {
  const { linkId } = args
  const userId = getUserId(ctx)
  const linkExists = await ctx.db.exists.Vote({
    user: { id: userId },
    link: { id: linkId },
  })
  if (linkExists) {
    throw new Error(`Already voted for link: ${linkId}`)
  }

  return ctx.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: linkId } },
      },
    },
    info,
  )
}

async function createHome(parent, {title, price, nbed}, ctx, info) {
  // console.log('received data', {title, price, nbed})
  return ctx.db.mutation.createHome(
    {
      data: {title, price, nbed}
    }, info
  )
}

async function deleteHome(parent, {id}, ctx, info) {
  return ctx.db.mutation.deleteHome(
    {
      where: { id }
    }
  )
}

async function voteHome(parent, args, ctx, info) {
  console.log("-------------here----------------")
  const { homeId } = args
  const userId = getUserId(ctx)
  const homeExists = await ctx.db.exists.VoteHome({
    user: { id: userId },
    home: { id: homeId },
  })

  if (homeExists) {
    throw new Error(`Already voted for home: ${homeId}`)
  } else {
    console.log("voted")
  }

  return ctx.db.mutation.createVoteHome(
    {
      data: {
        user: { connect: { id: userId } },
        home: { connect: { id: homeId } },
      },
    },
    info,
  )
}

module.exports = {
  post,
  signup,
  login,
  vote,
  createHome,
  deleteHome,
  voteHome
}
