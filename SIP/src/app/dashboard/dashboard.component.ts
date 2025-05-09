import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Chart, registerables } from 'chart.js';
import{DashboardService } from '../services/dashboard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  items = [
    { label: '', icon: 'pi pi-home', route: '/', escape: false },
    { label: 'Tableau de bord', icon: 'pi pi-chart-bar', escape: false }
  ];

  countries = [
    { name: 'Tunisie', value: 33, color: '#3B82F6' },
    { name: 'France', value: 27, color: '#10B981' },
    { name: 'Sénégal', value: 20, color: '#F59E0B' },
    { name: 'Niger', value: 10, color: '#EF4444' },
    { name: 'Amérique', value: 7, color: '#8B5CF6' },
    { name: 'Autre', value: 3, color: '#ECDCBF' },
  ];

  subscriptionRateData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    realValues: [1.2, 1.3, 1.4, 1.5, 1.45, 1.5, 1.55, 1.6, 1.58, 1.62, 1.65, 1.7],
    targetValues: [1.3, 1.4, 1.5, 1.6, 1.6, 1.7, 1.7, 1.8, 1.8, 1.9, 1.9, 2.0]
  };

  sectors: any[] = [];
  governoratesChart: Chart | undefined;
  sectorPieChart: Chart | undefined;

  governorates: any[] = [];
  maxGovernorateValue: number = 0;
  totalInvestment: number = 0;

  subscriptionData: any[] = [];
  subscriptionChart: Chart | undefined;

  shareholderStats = {
    total: 0,
  tunisianPercentage: 0,
  foreignPercentage: 0,
  tunisianCount: 0,
  foreignCount: 0
  };

  constructor(private cdr: ChangeDetectorRef,private dashboardService: DashboardService) {}
  //  propriétés 
societeCount: number = 0;
cacCount: number = 0;
contactsCount: number = 0;
reunionCount: number = 0;
achatsCount: number = 0;
ventesCount: number = 0;
souscriptionsCount: number = 0;
liberationsCount: number = 0;
usersCount: number = 0;

  ngOnInit(): void {
    Chart.register(...registerables);

    // Récupération des données
  this.dashboardService.getSocieteCount().subscribe(count => {
    this.societeCount = count;
  });
  
  this.dashboardService.getCACCount().subscribe(count => {
    this.cacCount = count;
  });

  this.dashboardService.getContactsCount().subscribe(count => {
    this.contactsCount = count;
  });
  this.dashboardService.getReunionCount().subscribe(count => {
    this.reunionCount = count;
  });
  this.dashboardService.getAchatsCount().subscribe(count => {
    this.achatsCount = count;
  });
  this.dashboardService.getVentesCount().subscribe(count => {
    this.ventesCount = count;
  });
  this.dashboardService.getSouscriptionsCount().subscribe(count => {
    this.souscriptionsCount = count;
  });
  this.dashboardService.getLiberationsCount().subscribe(count => {
    this.liberationsCount = count;
  });
  this.dashboardService.getUsersCount().subscribe(count => {
    this.usersCount = count;
  });
  this.dashboardService.getTotalActionnaires().subscribe(total => {
    console.log('Total actionnaires reçu:', total); // Ajout pour debug
    this.shareholderStats.total = total;
    this.calculatePercentages();
  });
  
  this.dashboardService.getActionnairesByNationalite().subscribe(({tunisiens, etrangers}) => {
    console.log('Répartition reçue:', {tunisiens, etrangers}); // Ajout pour debug
    this.shareholderStats.tunisianCount = tunisiens;
    this.shareholderStats.foreignCount = etrangers;
    this.calculatePercentages();
  });
  this.dashboardService.getMontantParGouvernorat().subscribe(data => {
    this.governorates = data.map(gov => ({
      id: gov.idGouvernorat,  // Notez le changement ici
      name: gov.nomGouvernorat,  // Et ici
      value: gov.totalGlobal,  // Et ici
      color: this.getRandomColor(),
      totalAchats: gov.totalAchats,  // Et ici
      totalSouscriptions: gov.totalSouscriptions  // Et ici
    }));
  
    this.maxGovernorateValue = Math.max(...this.governorates.map(g => g.value));
    this.totalInvestment = this.governorates.reduce((sum, gov) => sum + gov.value, 0);
    
    // Mettez à jour les données filtrées
    this.filteredGovernorates = [...this.governorates];
    this.displayedGovernorates = [...this.governorates];
    
    // Créez le graphique après avoir reçu les données
    this.createGovernoratesChart();
  });
  this.dashboardService.getMontantAchatsParSecteur().subscribe(data => {
    this.sectors = data.map(secteur => ({
      id: secteur.idSecteur,
      name: secteur.nomSecteur,
      value: secteur.montantTotal,
      color: this.getRandomColor(),
      nombreProjets: secteur.nombreProjets
    }));
  
    // Recréez le pie chart avec les nouvelles données
    this.createPieChart();
  });
  this.dashboardService.getTauxSouscriptionParMois().subscribe(data => {
    this.subscriptionData = data;
    this.createSubscriptionRateChart();
  });
  
    
    setTimeout(() => {
      this.createCharts();
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }
  calculatePercentages() {
    if (this.shareholderStats.total > 0) {
      this.shareholderStats.tunisianPercentage = Math.round((this.shareholderStats.tunisianCount / this.shareholderStats.total) * 100);
      this.shareholderStats.foreignPercentage = 100 - this.shareholderStats.tunisianPercentage;
    } else {
      this.shareholderStats.tunisianPercentage = 0;
      this.shareholderStats.foreignPercentage = 0;
    }
  }
  getRandomColor(): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#64748B', '#8B5CF6'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  printDashboard(): void {
    const cardsSection = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6') as HTMLElement;
    if (!cardsSection) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = cardsSection.cloneNode(true) as HTMLElement;

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; }
        .bg-white { background-color: #fff; }
        .rounded-xl { border-radius: 0.75rem; }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .border { border-width: 1px; }
        .border-gray-100 { border-color: #F3F4F6; }
        .overflow-hidden { overflow: hidden; }
        .p-5 { padding: 1.25rem; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-start { align-items: flex-start; }
        .relative { position: relative; }
        .z-10 { z-index: 10; }
        .gap-3 { gap: 0.75rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .bg-blue-100\\/80 { background-color: rgba(59, 130, 246, 0.8); }
        .bg-green-100\\/80 { background-color: rgba(16, 185, 129, 0.8); }
        .bg-purple-100\\/80 { background-color: rgba(139, 92, 246, 0.8); }
        .bg-amber-100\\/80 { background-color: rgba(245, 158, 11, 0.8); }
        .bg-orange-100\\/80 { background-color: rgba(249, 115, 22, 0.8); }
        .bg-red-100\\/80 { background-color: rgba(239, 68, 68, 0.8); }
        .bg-indigo-100\\/80 { background-color: rgba(99, 102, 241, 0.8); }
        .bg-teal-100\\/80 { background-color: rgba(20, 184, 166, 0.8); }
        .bg-pink-100\\/80 { background-color: rgba(236, 72, 153, 0.8); }
        .p-2 { padding: 0.5rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .text-blue-600 { color: #3B82F6; }
        .text-green-600 { color: #10B981; }
        .text-purple-600 { color: #8B5CF6; }
        .text-amber-600 { color: #D97706; }
        .text-orange-600 { color: #F97316; }
        .text-red-600 { color: #EF4444; }
        .text-indigo-600 { color: #6366F1; }
        .text-teal-600 { color: #14B8A6; }
        .text-pink-600 { color: #EC4899; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .font-semibold { font-weight: 600; }
        .text-gray-500 { color: #6B7280; }
        .uppercase { text-transform: uppercase; }
        .tracking-wider { letter-spacing: 0.05em; }
        .text-2xl { font-size: 1.5rem; }
        .font-bold { font-weight: 700; }
        .text-gray-800 { color: #1F2937; }
        .mb-1 { margin-bottom: 0.25rem; }
        .items-center { align-items: center; }
        .mr-1 { margin-right: 0.25rem; }
        .flex-col { flex-direction: column; }
        .items-end { align-items: flex-end; }
        .bg-blue-50\\/70 { background-color: rgba(59, 130, 246, 0.7); }
        .bg-green-50\\/70 { background-color: rgba(16, 185, 129, 0.7); }
        .bg-purple-50\\/70 { background-color: rgba(139, 92, 246, 0.7); }
        .bg-amber-50\\/70 { background-color: rgba(245, 158, 11, 0.7); }
        .bg-orange-50\\/70 { background-color: rgba(249, 115, 22, 0.7); }
        .bg-red-50\\/70 { background-color: rgba(239, 68, 68, 0.7); }
        .bg-indigo-50\\/70 { background-color: rgba(99, 102, 241, 0.7); }
        .bg-teal-50\\/70 { background-color: rgba(20, 184, 166, 0.7); }
        .bg-pink-50\\/70 { background-color: rgba(236, 72, 153, 0.7); }
        .p-2\\.5 { padding: 0.625rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .text-xl { font-size: 1.25rem; }
        .absolute { position: absolute; }
        .-top-2 { top: -0.5rem; }
        .-right-2 { right: -0.5rem; }
        .bg-white { background-color: #fff; }
        .border-blue-100 { border-color: #DBEAFE; }
        .border-green-100 { border-color: #D1FAE5; }
        .border-purple-100 { border-color: #EDE9FE; }
        .border-amber-100 { border-color: #FEF3C7; }
        .border-orange-100 { border-color: #FFEDD5; }
        .border-red-100 { border-color: #FEE2E2; }
        .border-indigo-100 { border-color: #E0E7FF; }
        .border-teal-100 { border-color: #CCFBF1; }
        .border-pink-100 { border-color: #FCE7F3; }
        .shadow-xs { box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05); }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
        .rounded-full { border-radius: 9999px; }
        .h-2 { height: 0.5rem; }
        .w-16 { width: 4rem; }
        .bg-blue-100 { background-color: #DBEAFE; }
        .bg-green-100 { background-color: #D1FAE5; }
        .bg-purple-100 { background-color: #EDE9FE; }
        .bg-amber-100 { background-color: #FEF3C7; }
        .bg-orange-100 { background-color: #FFEDD5; }
        .bg-red-100 { background-color: #FEE2E2; }
        .bg-indigo-100 { background-color: #E0E7FF; }
        .bg-teal-100 { background-color: #CCFBF1; }
        .bg-pink-100 { background-color: #FCE7F3; }
        .bg-blue-500 { background-color: #3B82F6; }
        .bg-green-500 { background-color: #10B981; }
        .bg-purple-500 { background-color: #8B5CF6; }
        .bg-amber-500 { background-color: #D97706; }
        .bg-orange-500 { background-color: #F97316; }
        .bg-red-500 { background-color: #EF4444; }
        .bg-indigo-500 { background-color: #6366F1; }
        .bg-teal-500 { background-color: #14B8A6; }
        .bg-pink-500 { background-color: #EC4899; }
        .mt-2 { margin-top: 0.5rem; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25%); }
        }
        @media print {
          body { margin: 0; }
          .grid { page-break-inside: avoid; }
        }
      </style>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Impression - Cartes du Tableau de bord</title>
          ${styles}
        </head>
        <body>
          ${content.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  displayedGovernorates = [...this.governorates];
  //maxGovernorateValue = Math.max(...this.governorates.map(g => g.value));
  governorateSearch = '';
  filteredGovernorates = [...this.governorates];

  filterGovernorates() {
    if (!this.governorateSearch) {
      this.filteredGovernorates = [...this.displayedGovernorates];
      return;
    }
    
    const searchTerm = this.governorateSearch.toLowerCase();
    this.filteredGovernorates = this.displayedGovernorates.filter(gov => 
      gov.name.toLowerCase().includes(searchTerm)
    );
  }

  sortBy(property: 'name' | 'value') {
    this.displayedGovernorates = [...this.governorates].sort((a, b) => {
      if (property === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b.value - a.value;
      }
    });
    this.filterGovernorates();
  }

  createCharts() {
    this.createSubscriptionRateChart();
    this.createGovernoratesChart();
    this.createPieChart();
  }

  /*get totalInvestment(): number {
    return this.countries.reduce((sum, country) => sum + country.value, 0);
  }*/

    createSubscriptionRateChart() {
      const ctx = document.getElementById('subscriptionRateChart');
      if (!ctx) return;
    
      // Détruire le graphique existant s'il y en a un
      if (this.subscriptionChart) {
        this.subscriptionChart.destroy();
      }
    
      // Formater les données pour le graphique
      const labels = this.subscriptionData.map(item => item.nomMois);
      const realValues = this.subscriptionData.map(item => item.pourcentageMontant);
      const targetValues = this.calculateTargetValues(realValues);
    
      this.subscriptionChart = new Chart(ctx as HTMLCanvasElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Souscriptions réelles',
              data: realValues,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#10B981',
              pointBorderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 7
            },
            {
              label: 'Objectif de souscriptions',
              data: targetValues,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              borderWidth: 3,
              borderDash: [5, 5],
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#3B82F6',
              pointBorderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 7
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              backgroundColor: '#1F2937',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 },
              padding: 12,
              displayColors: false,
              callbacks: {
                label: (context) => {
                  const dataset = context.dataset;
                  const value = context.raw as number;
                  const label = dataset.label || '';
                  const moisData = this.subscriptionData[context.dataIndex];
                  const details = [
                    `${label}: ${value.toFixed(2)}%`,
                    `Montant: ${moisData.montantTotal.toLocaleString('fr-FR')} TND`,
                    `Souscriptions: ${moisData.nombreSouscriptions}`
                  ];
                  return details;
                },
                title: (items) => {
                  return `Mois: ${items[0].label}`;
                }
              }
            },
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (value) => `${value}%`,
                font: { size: 11 }
              },
              grid: {
                drawTicks: false,
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false,
                drawTicks: false
              },
              ticks: {
                font: { size: 11 }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
    }
    calculateTargetValues(realValues: number[]): number[] {
      // Vous pouvez personnaliser cette logique selon vos besoins
      return realValues.map((value, index) => {
        // Exemple: objectif = valeur réelle + 20% avec un maximum de 100%
        return Math.min(value * 1.2, 100);
      });
    }

  createDoughnutChart() {
    const ctx = document.getElementById('countryDoughnutChart');
    if (!ctx) return;

    new Chart(ctx as HTMLCanvasElement, {
      type: 'doughnut',
      data: {
        labels: this.countries.map(c => c.name),
        datasets: [{
          data: this.countries.map(c => c.value),
          backgroundColor: this.countries.map(c => c.color),
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const percentage = Math.round((value / this.totalInvestment) * 100);
                return `${context.label}: ${value}M TND (${percentage}%)`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  createPieChart() {
    const ctx = document.getElementById('sectorPieChart') as HTMLCanvasElement;
    if (!ctx) return;
  
    // Détruire le graphique existant s'il y en a un
    if (this.sectorPieChart) {
      this.sectorPieChart.destroy();
    }
  
    this.sectorPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.sectors.map(s => s.name),
        datasets: [{
          data: this.sectors.map(s => s.value),
          backgroundColor: this.sectors.map(s => s.color),
          borderWidth: 1,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = this.sectors.reduce((sum, sector) => sum + sector.value, 0);
                const percentage = Math.round((value / total) * 100);
                const secteur = this.sectors.find(s => s.name === label);
                const projets = secteur ? secteur.nombreProjets : 0;
                
                return [
                  `${label}: ${value.toLocaleString('fr-FR')} TND`,
                  `Projets: ${projets}`,
                  `Part: ${percentage}%`
                ];
              }
            }
          }
        }
      }
    });
  }

  createGovernoratesChart() {
    const ctx = document.getElementById('governoratesBarChart');
    if (!ctx) return;
  
    const sortedGovernorates = [...this.governorates].sort((a, b) => b.value - a.value);
  
    this.governoratesChart = new Chart(ctx as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: sortedGovernorates.map(g => g.name),
        datasets: [{
          label: 'Investissement Total (TND)',
          data: sortedGovernorates.map(g => g.value),
          backgroundColor: sortedGovernorates.map(g => this.hexToRgba(g.color, 0.7)),
          borderColor: sortedGovernorates.map(g => g.color),
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: sortedGovernorates.map(g => g.color),
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const gov = sortedGovernorates[context.dataIndex];
                const value = context.raw as number;
                const percentage = (value / this.totalInvestment * 100).toFixed(1);
                return [
                  `Total: ${value.toLocaleString('fr-FR')} TND`,
                  `Achats: ${gov.totalAchats.toLocaleString('fr-FR')} TND`,
                  `Souscriptions: ${gov.totalSouscriptions.toLocaleString('fr-FR')} TND`,
                  `Part: ${percentage}%`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value.toLocaleString('fr-FR')} TND`
            },
            grid: { display: false }
          },
          x: {
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { autoSkip: false }
          }
        }
      }
    });
  }

  hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  printCurveSection(): void {
    const curveSection = document.querySelector('.curve-section') as HTMLElement;
    if (!curveSection) return;
  
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
  
    const content = curveSection.cloneNode(true) as HTMLElement;
  
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .curve-section { width: 100%; max-width: 800px; }
        .chart-container { position: relative; height: 600px; }
        canvas { width: 100% !important; height: 100% !important; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .gap-2 { gap: 8px; }
        .gap-4 { gap: 16px; }
        .text-lg { font-size: 1.125rem; }
        .font-semibold { font-weight: 600; }
        .text-gray-800 { color: #1F2937; }
        .text-sm { font-size: 0.875rem; }
        .text-gray-500 { color: #6B7280; }
        .w-3 { width: 12px; }
        .h-3 { height: 12px; }
        .bg-blue-500 { background-color: #3B82F6; }
        .bg-green-500 { background-color: #10B981; }
        .rounded-full { border-radius: 9999px; }
        .mr-1 { margin-right: 4px; }
        button { display: none; }
        @media print {
          body { margin: 0; }
          .curve-section { page-break-inside: avoid; }
        }
      </style>
    `;
  
    const chartJsScript = `
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    `;
  
    const labels = JSON.stringify(this.subscriptionData.map(item => item.nomMois));
    const realValues = JSON.stringify(this.subscriptionData.map(item => item.pourcentageMontant));
    const targetValues = JSON.stringify(this.calculateTargetValues(this.subscriptionData.map(item => item.pourcentageMontant)));
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Impression - Taux de progression des souscriptions STB</title>
          ${styles}
          ${chartJsScript}
        </head>
        <body>
          <h2 style="text-align: center; margin-bottom: 20px;">Taux de progression des souscriptions STB - 2025</h2>
          ${content.outerHTML}
          <div style="margin-top: 20px; text-align: center; font-size: 0.9rem;">
            <p>Total des souscriptions: ${this.subscriptionData.reduce((sum, item) => sum + item.montantTotal, 0).toLocaleString('fr-FR')} TND</p>
            <p>Nombre total de souscriptions: ${this.subscriptionData.reduce((sum, item) => sum + item.nombreSouscriptions, 0)}</p>
          </div>
          <script>
            document.addEventListener('DOMContentLoaded', () => {
              const ctx = document.getElementById('subscriptionRateChart');
              if (!ctx) return;
  
              const labels = ${labels};
              const realValues = ${realValues};
              const targetValues = ${targetValues};
  
              new Chart(ctx, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [
                    {
                      label: 'Souscriptions réelles',
                      data: realValues,
                      borderColor: '#10B981',
                      backgroundColor: 'rgba(16, 185, 129, 0.05)',
                      borderWidth: 3,
                      tension: 0.4,
                      fill: true,
                      pointBackgroundColor: '#fff',
                      pointBorderColor: '#10B981',
                      pointBorderWidth: 3,
                      pointRadius: 5,
                      pointHoverRadius: 7
                    },
                    {
                      label: 'Objectif de souscriptions',
                      data: targetValues,
                      borderColor: '#3B82F6',
                      backgroundColor: 'rgba(59, 130, 246, 0.05)',
                      borderWidth: 3,
                      borderDash: [5, 5],
                      tension: 0.4,
                      fill: true,
                      pointBackgroundColor: '#fff',
                      pointBorderColor: '#3B82F6',
                      pointBorderWidth: 3,
                      pointRadius: 5,
                      pointHoverRadius: 7
                    }
                  ]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      backgroundColor: '#1F2937',
                      titleFont: { size: 14, weight: 'bold' },
                      bodyFont: { size: 13 },
                      padding: 12,
                      displayColors: false,
                      callbacks: {
                        label: function(context) {
                          const dataset = context.dataset;
                          const value = context.raw;
                          const label = dataset.label || '';
                          return \`\${label}: \${value.toFixed(2)}%\`;
                        },
                        title: function(items) {
                          return \`Mois: \${items[0].label}\`;
                        }
                      }
                    },
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: function(value) { return \`\${value}%\`; },
                        font: { size: 11 }
                      },
                      grid: {
                        drawTicks: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                        drawTicks: false
                      },
                      ticks: {
                        font: { size: 11 }
                      }
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index'
                  }
                }
              });
  
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            });
          </script>
        </body>
      </html>
    `);
  
    printWindow.document.close();
  }

  printMapSection(): void {
    const mapSection = document.querySelector('.map-section') as HTMLElement;
    if (!mapSection) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = mapSection.cloneNode(true) as HTMLElement;

    const allGovernorates = this.governorates.map(gov => `
      <tr class="border-b border-gray-100">
        <td class="py-3 pl-2">
          <div class="flex items-center">
            <span class="w-3 h-3 rounded-full mr-3 flex-shrink-0" style="background-color: ${gov.color}"></span>
            <span class="font-medium">${gov.name}</span>
          </div>
        </td>
        <td class="text-right pr-4 font-medium">
          ${gov.value}M
        </td>
        <td>
          <div class="flex items-center">
            <div class="w-full bg-gray-100 rounded-full h-2.5 mr-3">
              <div class="h-2.5 rounded-full transition-all duration-500" style="background-color: ${gov.color}; width: ${(gov.value / this.maxGovernorateValue) * 100}%;">
              </div>
            </div>
          </div>
        </td>
      </tr>
    `).join('');

    const table = content.querySelector('table tbody');
    if (table) {
      table.innerHTML = allGovernorates;
    }

    const summary = content.querySelector('.border-t.text-sm.text-gray-500');
    if (summary) {
      summary.innerHTML = `${this.governorates.length} gouvernorats`;
    }

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .map-section { width: 100%; max-width: 600px; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-start { align-items: flex-start; }
        .gap-2 { gap: 8px; }
        .text-xl { font-size: 1.25rem; }
        .text-sm { font-size: 0.875rem; }
        .font-semibold { font-weight: 600; }
        .text-gray-800 { color: #1F2937; }
        .text-gray-500 { color: #6B7280; }
        .mb-1 { margin-bottom: 4px; }
        .mb-4 { margin-bottom: 16px; }
        .relative { position: relative; }
        input { display: none; }
        .pi-search { display: none; }
        .overflow-auto { overflow: visible !important; max-height: none !important; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; }
        th { text-align: left; color: #6B7280; border-bottom: 1px solid #E5E7EB; }
        td { border-bottom: 1px solid #E5E7EB; }
        .text-right { text-align: right; }
        .font-medium { font-weight: 500; }
        .w-3 { width: 12px; }
        .h-3 { height: 12px; }
        .rounded-full { border-radius: 9999px; }
        .mr-3 { margin-right: 12px; }
        .bg-gray-100 { background-color: #F3F4F6; }
        .h-2\\.5 { height: 10px; }
        .w-full { width: 100%; }
        .border-t { border-top: 1px solid #E5E7EB; }
        .pt-4 { padding-top: 16px; }
        button { display: none; }
        @media print {
          body { margin: 0; }
          .map-section { page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      </style>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Impression - Investissements par gouvernorat</title>
          ${styles}
        </head>
        <body>
          ${content.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  printSectorPieChartSection(): void {
    const pieSection = document.querySelector('.sector-pie-section') as HTMLElement;
    if (!pieSection) return;
  
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
  
    const content = pieSection.cloneNode(true) as HTMLElement;
    const canvas = content.querySelector('#sectorPieChart') as HTMLCanvasElement;
    if (canvas) {
      canvas.setAttribute('width', '600');
      canvas.setAttribute('height', '400');
    }
  
    const total = this.sectors.reduce((sum, sector) => sum + sector.value, 0);
  
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .sector-pie-section { width: 100%; max-width: 800px; }
        .chart-container { position: relative; width: 600px; height: 400px; margin: 0 auto; }
        canvas { width: 600px !important; height: 400px !important; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .gap-2 { gap: 8px; }
        .text-lg { font-size: 1.125rem; }
        .font-semibold { font-weight: 600; }
        .text-gray-800 { color: #1F2937; }
        button { display: none; }
        .legend-container { display: flex; flex-wrap: wrap; justify-content: center; margin-top: 20px; }
        .legend-item { display: flex; flex-direction: column; margin: 10px; padding: 10px; background: #f8f9fa; border-radius: 8px; min-width: 200px; }
        .legend-header { display: flex; align-items: center; margin-bottom: 5px; }
        .legend-marker { width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .legend-title { font-weight: bold; }
        .legend-detail { font-size: 0.875rem; color: #6c757d; }
        @media print {
          body { margin: 0; }
          .sector-pie-section { page-break-inside: avoid; }
        }
      </style>
    `;
  
    const chartJsScript = `
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    `;
  
    const legendHtml = this.sectors.map((sector) => `
      <div class="legend-item">
        <div class="legend-header">
          <span class="legend-marker" style="background-color: ${sector.color};"></span>
          <span class="legend-title">${sector.name}</span>
        </div>
        <div class="legend-detail">Montant: ${sector.value.toLocaleString('fr-FR')} TND</div>
        <div class="legend-detail">Projets: ${sector.nombreProjets}</div>
        <div class="legend-detail">Part: ${Math.round((sector.value / total) * 100)}%</div>
      </div>
    `).join('');
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Impression - Répartition des achats par secteur</title>
          ${styles}
          ${chartJsScript}
        </head>
        <body>
          <h2 style="text-align: center; margin-bottom: 20px;">Répartition des achats par secteur</h2>
          ${content.outerHTML}
          <div class="legend-container">${legendHtml}</div>
          <div style="text-align: center; margin-top: 20px; font-size: 0.9rem;">
            Total des achats: ${total.toLocaleString('fr-FR')} TND
          </div>
          <script>
            document.addEventListener('DOMContentLoaded', () => {
              const ctx = document.getElementById('sectorPieChart');
              if (!ctx) return;
  
              const sectors = ${JSON.stringify(this.sectors)};
              const total = ${total};
  
              const chart = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: sectors.map(s => s.name),
                  datasets: [{
                    data: sectors.map(s => s.value),
                    backgroundColor: sectors.map(s => s.color),
                    borderWidth: 1,
                    hoverOffset: 10
                  }]
                },
                options: {
                  responsive: false,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw;
                          const percentage = Math.round((value / total) * 100);
                          const secteur = sectors.find(s => s.name === label);
                          const projets = secteur ? secteur.nombreProjets : 0;
                          return [
                            \`\${label}: \${value.toLocaleString('fr-FR')} TND\`,
                            \`Projets: \${projets}\`,
                            \`Part: \${percentage}%\`
                          ];
                        }
                      }
                    }
                  }
                }
              });
  
              setTimeout(() => {
                window.print();
                window.close();
              }, 1000);
            });
          </script>
        </body>
      </html>
    `);
  
    printWindow.document.close();
  }
  printShareholderStatsSection(): void {
    const statsSection = document.querySelector('.shareholder-stats-section') as HTMLElement;
    if (!statsSection) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = statsSection.cloneNode(true) as HTMLElement;

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .shareholder-stats-section { width: 100%; max-width: 600px; }
        .flex { display: flex; }
        .flex-wrap { flex-wrap: wrap; }
        .justify-around { justify-content: space-around; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .gap-6 { gap: 1.5rem; }
        .relative { position: relative; }
        .w-24 { width: 6rem; }
        .h-24 { height: 6rem; }
        svg { transform: rotate(-90deg); }
        .circle-bg { stroke: #E5E7EB; }
        .circle { stroke-linecap: round; }
        .absolute { position: absolute; }
        .inset-0 { top: 0; left: 0; right: 0; bottom: 0; }
        .text-2xl { font-size: 1.5rem; }
        .font-bold { font-weight: 700; }
        .text-gray-800 { color: #1F2937; }
        .mt-2 { margin-top: 0.5rem; }
        .text-sm { font-size: 0.875rem; }
        .text-gray-500 { color: #6B7280; }
        .text-lg { font-size: 1.125rem; }
        .font-semibold { font-weight: 600; }
        .justify-between { justify-content: space-between; }
        .mb-4 { margin-bottom: 1rem; }
        button { display: none; }
        @media print {
          body { margin: 0; }
          .shareholder-stats-section { page-break-inside: avoid; }
        }
      </style>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Impression - Statistiques des actionnaires</title>
          ${styles}
        </head>
        <body>
          ${content.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }
}
