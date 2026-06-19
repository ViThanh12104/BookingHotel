// src/pages/HomePage/Section/Section.js

import React from "react";
import "./Section.scss";

const Section = ({ title, data, type }) => {
    return (
        <div className="section-container">
            <h2>{title}</h2>

            <div className="section-list">
                {data.map((item) => (
                    <div className="card-item" key={item.id}>
                        <img src={item.image} alt={item.title} />

                        <div className="card-content">
                            <h3>{item.title}</h3>

                            {type === "destination" && (
                                <p>{item.desc}</p>
                            )}

                            {type === "hotel" && (
                                <>
                                    <p>{item.price}</p>
                                    <span>⭐ {item.rating}</span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Section;