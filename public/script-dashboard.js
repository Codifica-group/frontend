const ctxEntrada = document.getElementById('graficoEntrada').getContext('2d');
    new Chart(ctxEntrada, {
      type: 'pie',
      data: {
        labels: ['Salário', 'Caixinhas', 'Outros'],
        datasets: [{
          label: 'Entradas',
          data: [500, 800, 200],
          backgroundColor: ['#58873e', '#7dac63', '#ace58d'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    const ctxSaida = document.getElementById('graficoSaida').getContext('2d');
    new Chart(ctxSaida, {
      type: 'pie',
      data: {
        labels: ['Aluguel', 'Transporte', 'Outros'],
        datasets: [{
          label: 'Saídas',
          data: [300, 125, 75],
          backgroundColor: ['#c26363', '#f97777', '#ffbcbc'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    document.getElementById('btnBalanca').addEventListener('click', function () {
      this.classList.toggle('ativo');
    });