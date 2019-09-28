import { compose, pure, withHandlers, mapProps } from 'recompose'
import { connect } from 'react-redux'
import map from 'ramda/src/map'
import mapObjIndexed from 'ramda/src/mapObjIndexed'
import ifElse from 'ramda/src/ifElse'
import omit from 'ramda/src/omit'
import flip from 'ramda/src/flip'
import apply from 'ramda/src/apply'
import prop from 'ramda/src/prop'

const flippedApply = flip(apply)

const lookup = flip(prop)

const isFunction = value => {
  return typeof value === 'function'
}

const omitProps = keys => mapProps(props => omit(keys, props))

const CONNECTED_PROPS = '$WITH_CONNECTED_HANDLER_CONNECTED_PROPS'

const withConnectedHandler = ({ handler, name, actions = {}, args = {} }) => {
  return compose(
    connect(
      (state, props) => ({
        [CONNECTED_PROPS]: map(
          ifElse(isFunction, flippedApply([state, props]), lookup(props)),
        )(args),
      }),
      actions,
    ),
    connect(null), // get dispatch
    withHandlers({
      [name]: ({ [CONNECTED_PROPS]: connectedProps, dispatch, ...rest }) => {
        return (...props) => {
          const connectedActions = mapObjIndexed(
            (_, actionName) => rest[actionName],
            actions,
          )
          const passedProps = {
            ...connectedProps,
            ...connectedActions,
            dispatch,
          }
          return handler(passedProps)(...props)
        }
      },
    }),
    omitProps([CONNECTED_PROPS]),
    pure,
  )
}

export default withConnectedHandler
