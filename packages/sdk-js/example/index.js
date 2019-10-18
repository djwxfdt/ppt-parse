/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import Library from '../lib/index'

const slideJson = require('../../../example/pptOutput1/output.json')

const scaleWrapper = document.createElement('div')

document.body.appendChild(scaleWrapper)

document.body.style.display = 'flex'
document.body.style.alignItems = 'center'
document.body.style.justifyContent = 'center'
document.body.style.width = '100vw'
document.body.style.height = '100vh'
document.body.style.overflow = 'hidden'
document.body.style.userSelect = 'none'

class App extends React.Component {
    constructor () {
        super()
        this.state = { page: 0 }
    }

    componentDidMount () {
        window.addEventListener('keyup', e => {
            if (e.keyCode === 39) {
                e.preventDefault()
                this.setState({ page: this.state.page + 1 })
            } else if (e.keyCode === 37) {
                e.preventDefault()
                this.setState({ page: this.state.page - 1 })
            }
        })

        document.body.addEventListener('click', e => {
            this.setState({ page: this.state.page + 1 })
        })

        const scaleWrapper = this.refs.wrapper

        const resize = () => {
            const w = window.innerWidth - 20
            const h = window.innerHeight - 20

            const scale = Math.min(w / slideJson.size.width, h / slideJson.size.height)

            if (scale < 1) {
                scaleWrapper.style.transform = `scale(${scale})`
                scaleWrapper.style.transformOrigin = 'center'
            }

            scaleWrapper.style.border = 'solid 1px gray'
        }

        window.addEventListener('resize', () => resize())

        Object.keys(slideJson.fonts).map(c => {
            const link = document.createElement('link')
            link.href = `https://fonts.googleapis.com/css?family=${c}&display=swap`
            link.rel = 'stylesheet'
            document.head.appendChild(link)
        })

        resize()
    }

    render () {
        return <div ref="wrapper">
            <Library jsonObj={slideJson} currentPage={this.state.page} />
        </div>
    }
}

ReactDOM.render(<App />, scaleWrapper)
