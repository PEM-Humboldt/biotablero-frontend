import {
  SmallBarsData,
  SmallBarsDataDetails,
} from "pages/search/shared_components/charts/SmallBars";
import {
  portfoliosByTarget,
  portfolioData,
} from "pages/search/types/portfolios";
import { SmallBarTooltip } from "pages/search/types/charts";
import formatNumber from "utils/format";
import SearchAPI from "utils/searchAPI";
import { textsObject } from "pages/search/types/texts";

export class TargetsController {
  portfoliosIds: Map<String, Set<number>>;
  targetsTexts: Array<{ name: string; texts: textsObject }>;
  portfoliosTexts: Array<{ name: string; description: string }>;
  constructor() {
    this.portfoliosIds = new Map();
    this.targetsTexts = [];
    this.portfoliosTexts = [];
  }

  /**
   * Get all available portfolios
   *
   * @returns List of portfolios
   */
  getPortolfiosList() {
    return SearchAPI.requestPortfoliosList();
  }

  /**
   * Get the portfolios data for all the targets
   *
   * @param areaType area type
   * @param areaId area id
   * @returns Array of promises to be resolved with data for each target
   */
  async getData(areaType: string, areaId: string | number) {
    const targets = await SearchAPI.requestTargetsList(areaType, areaId);
    return targets.map((target) =>
      SearchAPI.requestPortfoliosByTarget(areaType, areaId, target.id).then(
        (res) => {
          const ids = new Set<number>();
          res.portfolios_data.forEach((portfolio) => {
            ids.add(portfolio.id);
          });
          this.portfoliosIds.set(target.name, ids);
          return res;
        }
      )
    );
  }

  /**
   * Get list of available portfolios ids for a given target
   *
   * @param {String} targetName target name
   *
   * @returns {Set<number> | undefined} list of available portfolios ids
   */
  getPortfoliosIdsByTarget(targetName: string) {
    return new Set(this.portfoliosIds.get(targetName));
  }

  /**
   * Returns whether a portfolio is into a target
   *
   * @param {String} targetName target name
   * @param {Number} portfolioId portfolio id
   *
   * @returns {Boolean} whether a portfolio is into a target
   */
  isPortfolioInTarget(targetName: string, portfolioId: number) {
    const portfolioIds = this.getPortfoliosIdsByTarget(targetName);
    if (!portfolioIds) return false;
    if (portfolioIds.has(portfolioId)) {
      return true;
    }
    return false;
  }

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {Array<portfoliosByTarget>} rawData raw data from RestAPI
   *
   * @returns {Array<SmallBarsData>} transformed data ready to be used by graph component
   */
  getGraphData(rawData: Array<portfoliosByTarget>) {
    const tooltips: Array<SmallBarTooltip> = [];
    const portfolios: Set<string> = new Set();
    const alternateAxisYValues: Record<string, string> = {};
    const transformedData: Array<SmallBarsData> = rawData.map((target) => {
      const objectData: Array<SmallBarsDataDetails> = [];
      target.portfolios_data.forEach((portfolio: portfolioData) => {
        const percentage = (portfolio.value / target.target_national) * 100;
        const info = {
          category: portfolio.short_name,
          value: percentage,
        };
        objectData.push(info);

        tooltips.push({
          group: target.target_name,
          category: portfolio.short_name,
          tooltipContent: [
            portfolio.name,
            `${formatNumber(percentage, 2)} %`,
            `${formatNumber(portfolio.value, 2)} c`,
          ],
        });

        if (!portfolios.has(portfolio.short_name)) {
          portfolios.add(portfolio.short_name);
        }
      });

      const object = {
        group: target.target_name,
        data: objectData,
      };

      alternateAxisYValues[
        target.target_name
      ] = `${target.target_national} ${target.target_units}`;

      return object;
    });

    return {
      transformedData,
      keys: Array.from(portfolios),
      tooltips,
      alternateAxisYValues,
    };
  }

  /**
   * Returns data transformed to be downloaded in the csv file
   *
   * @param {portfoliosByTarget[]} data data array for SmallBars graph in portfolios by targets tab
   *
   * @returns {Object[]} portfolios by targets graph data transformed to be downloaded in a csv file
   */
  getDownloadData = (data: Array<portfoliosByTarget>) => {
    const result: Array<{
      target_name: string;
      target_national: number;
      target_units_short: string;
      target_units: string;
      portfolio_name: string;
      portfolio_short_name: string;
      portfolio_value: number;
      portfolio_percentage: number;
    }> = [];
    data.forEach((target: portfoliosByTarget) =>
      target.portfolios_data.forEach((portfolio) => {
        result.push({
          target_name: target.target_name,
          target_national: target.target_national,
          target_units_short: target.target_units_short,
          target_units: target.target_units,
          portfolio_name: portfolio.name,
          portfolio_short_name: portfolio.short_name,
          portfolio_value: portfolio.value,
          portfolio_percentage:
            (portfolio.value / target.target_national) * 100,
        });
      })
    );
    return result;
  };

  /**
   * Get portfolios texts
   *
   * @returns Array of portfolios description texts
   */
  getPortfoliosTexts() {
    const portfoliosTexts: Array<{ name: string; description: string }> = [
      { name: "WCMC", description: "Información WCMC" },
      { name: "ELSA", description: "Información ELSA" },
      { name: "WEPLAN", description: "Información WEPLAN" },
      {
        name: "Especies, Carbono y Agua",
        description: "Información Especies, Carbono y Agua",
      },
      { name: "ACC", description: "Información ACC" },
    ];
    this.portfoliosTexts = portfoliosTexts;
  }

  /**
   * Get targets texts
   *
   * @returns Array of targets components texts
   */
  getTargetsInfoTexts() {
    const dummyTexts = [
      {
        info: "Información ejemplo 1",
        cons: "Consideraciones ejemplo 1",
        meto: "Metodología ejemplo 1",
        quote: "Autoria ejemplo 1",
      },
      {
        info: "Información ejemplo 2",
        cons: "Consideraciones ejemplo 2",
        meto: "Metodología ejemplo 2",
        quote: "Autoria ejemplo 2",
      },
    ];

    const targetsTexts: Array<{ name: string; texts: textsObject }> = [
      { name: "Especies", texts: dummyTexts[0] },
      { name: "Ecosistemas", texts: dummyTexts[1] },
      { name: "Servicios Ecosistémicos", texts: dummyTexts[0] },
      { name: "Conectividad", texts: dummyTexts[1] },
      { name: "Cambio Climático", texts: dummyTexts[0] },
      { name: "Deforestación", texts: dummyTexts[1] },
      { name: "Restauración", texts: dummyTexts[0] },
      { name: "Aguas - Rios", texts: dummyTexts[1] },
    ];
    this.targetsTexts = targetsTexts;
  }

  /**
   * Get texts of a selected target
   *
   * @param {String} targetName target name
   *
   * @returns {Object | undefined} information texts of a target
   */
  getTargetsInfoText(targetName: string) {
    let targetTexts;
    const target = this.targetsTexts.find(
      (targetText) => targetName === targetText.name
    );
    if (target) targetTexts = target.texts;
    return targetTexts;
  }

  /**
   * Get description of a selected portfolio
   *
   * @param {String} portfolioName portfolio name
   *
   * @returns {String | undefined} description of a portfolio
   */
  getPortfolioDescription(portfolioName: string) {
    let portfolioDescription;
    const portfolio = this.portfoliosTexts.find(
      (targetText) => portfolioName === targetText.name
    );
    if (portfolio) portfolioDescription = portfolio.description;
    return portfolioDescription;
  }
}
