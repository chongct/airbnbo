// this function is needed to include postedBy and votes fields
function homes(parent, args, context, info) {
  const { homeIds } = parent
  return context.db.query.homes({ where: { id_in: homeIds } }, info)
}

module.exports = {
  homes,
}
