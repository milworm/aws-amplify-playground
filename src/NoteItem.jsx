import React from 'react'
import PropTypes from 'prop-types'

export default class NoteItem extends React.Component {
    static propTypes = {
        data: PropTypes.object.isRequired
    }

    static defaultProps = {
        
    }

    render() {
        let { data } = this.props

        return (
            <div className="flex items-center outline mb3 pa3">
                <div className="fl flex-auto pa2">{data.name}</div>
                <div className="fl pa2">
                    <button className="white ph4 pv2 bg-dark-green" onClick={this.onDeleteClick}>
                        Delete
                    </button>
                </div>
            </div>
        )
    }

    onDeleteClick = () => {
        this.props.onDelete(this.props.data)
    }
}