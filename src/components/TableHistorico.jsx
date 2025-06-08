import React from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import '../styles/style-historico.css';

export default function Table(props) {
    return (
        <div className="table-container" style={props.rounded ? { borderRadius: "0 8px 8px 8px" } : undefined}>
            <table>
                <thead>
                    <tr>
                        {props.columns.map((col, index) => (
                            <th
                                key={index}
                                style={props.columnWidths && props.columnWidths[index] ? { width: props.columnWidths[index] } : undefined}
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {props.columns.map((col, colIndex) => {
                                if (col === "Editar") {
                                    return (
                                        <td style={{width: '1%'}} key={colIndex}>
                                            <button
                                                className="icon-action-btn"
                                                onClick={() => props.onEdit(row._original, props.tipo)}
                                                title="Editar"
                                            >
                                                <FiEdit size={18} />
                                            </button>
                                        </td>
                                    );
                                }
                                return (
                                    <td
                                        key={colIndex}
                                        style={props.columnWidths && props.columnWidths[colIndex] ? { width: props.columnWidths[colIndex] } : undefined}
                                    >
                                        {row[col]}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}