import React, { Component, createRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import './CustomScrollbars.scss';

class CustomScrollbars extends Component {
    ref = createRef();

    getScrollLeft = () => {
        return this.ref.current?._container?.scrollLeft || 0;
    };

    getScrollTop = () => {
        return this.ref.current?._container?.scrollTop || 0;
    };

    scrollToBottom = () => {
        if (!this.ref.current) return;
        const el = this.ref.current._container;
        el.scrollTop = el.scrollHeight;
    };

    scrollTo = (targetTop) => {
        if (!this.ref.current) return;
        const el = this.ref.current._container;

        let iteration = 0;
        const originalTop = el.scrollTop;

        const scroll = () => {
            iteration++;
            if (iteration > 30) return;

            el.scrollTop =
                originalTop + ((targetTop - originalTop) / 30) * iteration;

            setTimeout(scroll, 20);
        };

        scroll();
    };

    render() {
        const {
            className,
            disableVerticalScroll,
            disableHorizontalScroll,
            children,
            ...otherProps
        } = this.props;

        return (
            <PerfectScrollbar
                ref={this.ref}
                options={{
                    suppressScrollX: disableHorizontalScroll,
                    suppressScrollY: disableVerticalScroll
                }}
                className={className ? className + ' custom-scrollbar' : 'custom-scrollbar'}
                {...otherProps}
            >
                {children}
            </PerfectScrollbar>
        );
    }
}

export default CustomScrollbars;