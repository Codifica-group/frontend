import { FiEdit, FiTrash } from 'react-icons/fi';
import '../styles/style-historico.css';

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
                            {props.columns.map((col, colIndex) => {
                                if (col === "Editar") {
                                    return (
                                        <td key={colIndex}>
                                            <button className="icon-action-btn" onClick={() => props.onEdit(row.id)} title="Editar">
                                                <FiEdit size={18} />
                                            </button>
                                        </td>
                                    );
                                }
                                if (col === "Apagar") {
                                    return (
                                        <td key={colIndex}>
                                            <button className="icon-action-btn" onClick={() => props.onDelete(row.id)} title="Apagar">
                                                <FiTrash size={18} />
                                            </button>
                                        </td>
                                    );
                                }
                                return <td key={colIndex}>{row[col]}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}