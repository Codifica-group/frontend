import React, { useEffect, useState } from 'react';
import { getDespesas } from '../utils/get';

export default function ContainerCategorias(props) {

    const [despesas, setDespesas] = useState();

    useEffect(() => {
        (async () => {
            try {
                setDespesas(await getDespesas());
                console.log(despesas);
            } catch (error) {
                console.error("Erro ao carregar despesas:", error);
            }
        })();   
    }, []);

    return (
        <div className="categoria-wrapper">
            <div className="categoria-container">
                {Object.entries(props.categorias).map(([categoriaNome, itens], index) => (
                    <details className="categoria" key={index}>
                        <summary>{categoriaNome}</summary>
                        <div className="categoria-info">
                            <ul>
                                {itens.map((item) => (
                                    <li key={item.id}>
                                        <div>{item.nome}</div> 
                                        <div> {despesas.map((despesa) => (
                                            despesa.produtoId === item.id ? `R$ -${despesa.valor}` : null
                                        ))}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
}