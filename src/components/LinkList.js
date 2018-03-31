import React, { Component } from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Link from './Link'
import CreateHomeForm from './CreateHomeForm'

class LinkList extends Component {

  render() {
    // console.log(this.props)

    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div>Loading....</div>
    }

    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error</div>
    }

    const linksToRender = this.props.feedQuery.feed.links

    // const linksToRender = [
    //   {
    //     id: '1',
    //     description: 'Prisma turns your database into a GraphQL API 😎 😎',
    //     url: 'https://www.prismagraphql.com'
    //   },
    //   {
    //     id: '2',
    //     description: 'The best GraphQL client',
    //     url: 'https://www.apollographql.com/docs/react/'
    //   }
    // ]

    return (

      <div>
        {linksToRender.map(link => <Link key={link.id} link={link} />)}
        <CreateHomeForm />
      </div>
    );
  }
}

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`

export default graphql(FEED_QUERY, { name: 'feedQuery' }) (LinkList)
// export default LinkList;
