import React from 'react';

export default function ContainerCategorias(props) {
    return (
        <div className="categoria-wrapper">
            <div className="categoria-container">
                {props.categorias.map((categoria, index) => (
                    <details className="categoria" key={index}>
                        <summary>Categoria {categoria}</summary>
                        <div className="categoria-info">
                            <ul>
                                <li>{props.tipo == "saida" ? "• Gasto" : "• Entrada"} 1</li>
                                <li>{props.tipo == "saida" ? "• Gasto" : "• Entrada"} 2</li>
                                <li>{props.tipo == "saida" ? "• Gasto" : "• Entrada"} 3</li>
                            </ul>
                        </div>
                    </details>
                ))}
            </div>
        </div>
    )

}