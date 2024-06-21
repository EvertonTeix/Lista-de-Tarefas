import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import img from "./assets/mao.png";
import { environment } from "./environments/environment.ts";

const url = environment.apiUrl;

function App() {
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [tarefaSelecionada, setTarefaSelecionada] = useState({
    isTarefa: "",
    isComplete: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefaSelecionada({
      ...tarefaSelecionada,
      [name]: value,
    });
  };

  const pedidoGet = async () => {
    await axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoPost = async () => {
    delete tarefaSelecionada.id;
    await axios
      .post(url, tarefaSelecionada)
      .then((response) => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoPut = async () => {
    await axios
      .put(url + "/" + tarefaSelecionada.id, tarefaSelecionada)
      .then((response) => {
        var resposta = response.data;
        var dadosAuxiliar = data.map((tarefa) => {
          if (tarefa.id === tarefaSelecionada.id) {
            return {
              ...tarefa,
              isTarefa: resposta.isTarefa,
              isComplete: resposta.isComplete,
            };
          }
          return tarefa;
        });
        setData(dadosAuxiliar);
        abrirFecharModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoDelete = async () => {
    try {
      await axios.delete(url + "/" + tarefaSelecionada.id);
      setData(data.filter((tarefa) => tarefa.id !== tarefaSelecionada.id));
      abrirFecharModalExcluir(); // Fechar modal após deletar com sucesso
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData]);

  const handleCheckboxChange = async (tarefa) => {
    const updatedTarefa = { ...tarefa, isComplete: !tarefa.isComplete };
    // Optionally, update the backend
    await axios
      .put(`${url}/${tarefa.id}`, updatedTarefa)
      .then((response) => {
        const updatedData = data.map((t) =>
          t.id === tarefa.id ? updatedTarefa : t
        );
        setData(updatedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  };

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  };

  const selecionarTarefa = (tarefa, opcao) => {
    setTarefaSelecionada(tarefa);
    opcao === "Editar" ? abrirFecharModalEditar() : abrirFecharModalExcluir();
  };

  return (
    <div className="tarefa-container">
      <br />
      <header>
        <h3>Lista de Tarefas</h3>
        <img src={img} alt="adicionar tarefa" />
        <button
          className="btn btn-success"
          onClick={() => abrirFecharModalIncluir()}
        >
          Adicionar Tarefa
        </button>
      </header>
      <table className="table">
  <thead>
    <tr>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {data.map((tarefa) => (
      <tr key={tarefa.id}>
        <td className={tarefa.isComplete ? "completed" : ""}>
          {tarefa.isTarefa}
        </td>
        <td>
          <input
            type="checkbox"
            checked={tarefa.isComplete}
            onChange={() => handleCheckboxChange(tarefa)}
          />
        </td>
        <td>
          <button
            className="btn btn-primary"
            onClick={() => selecionarTarefa(tarefa, "Editar")}
          >
            Editar
          </button>
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => selecionarTarefa(tarefa, "Excluir")}
          >
            Excluir
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      <Modal isOpen={modalIncluir}>
        <ModalHeader>Adicionar Tarefa</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Tarefa: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="isTarefa"
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>
            Incluir
          </button>
          {"  "}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalIncluir()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Tarefa</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input
              type="text"
              className="form-control"
              readOnly
              value={tarefaSelecionada && tarefaSelecionada.id}
            />
            <br />
            <label>Tarefa: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="isTarefa"
              onChange={handleChange}
              value={tarefaSelecionada && tarefaSelecionada.isTarefa}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>
            Editar
          </button>
          {"  "}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão desta tarefa:{" "}
          {tarefaSelecionada && tarefaSelecionada.isTarefa} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()}>
            Sim
          </button>
          <button
            className="btn btn-primary"
            onClick={() => abrirFecharModalExcluir()}
          >
            Não
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
