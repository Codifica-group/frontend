import React from 'react';

export default function Table(props) {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {props.columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {props.columns.map((col, colIndex) => (
                                <td key={colIndex}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}