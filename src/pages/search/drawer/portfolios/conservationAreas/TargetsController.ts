import {
  SmallBarsData,
  SmallBarsDataDetails,
} from "pages/search/shared_components/charts/SmallBars";
import {
  portfoliosByTarget,
  portfolioData,
  targetOrPortfolio,
} from "pages/search/types/portfolios";
import { SmallBarTooltip } from "pages/search/types/charts";
import formatNumber from "utils/format";
import SearchAPI from "utils/searchAPI";
import { textsObject } from "pages/search/types/texts";

export class TargetsController {
  portfoliosIds: Map<String, Set<number>>;
  targets: Array<targetOrPortfolio>;
  targetsTexts: Array<{ textKey: string; texts: textsObject }>;
  portfoliosTexts: Array<{ name: string; description: string }>;
  constructor() {
    this.portfoliosIds = new Map();
    this.targetsTexts = [];
    this.portfoliosTexts = [];
    this.targets = [];
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
    this.targets = targets;
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
        const percentage = portfolio.value / target.target_national;
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
            `${formatNumber(percentage * 100, 2)} %`,
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
  loadPortfoliosTexts() {
    let portfoliosTexts: Array<{ name: string; description: string }> = [];

    [
      "portfoliosBSERN",
      "portfoliosELSA",
      "portfoliosRWFC",
      "portfoliosBCAN",
      "portfoliosACCBA",
    ].forEach((item) => {
      SearchAPI.requestSectionTexts(item)
        .then((res) => {
          portfoliosTexts.push({ name: item, description: res.info });
        })
        .catch(() => {
          throw new Error("Error getting data");
        });
    });
    this.portfoliosTexts = portfoliosTexts;
  }

  /**
   * Get targets texts
   *
   * @returns Array of targets components texts
   */
  loadTargetsTexts() {
    let targetsTexts: Array<{ textKey: string; texts: textsObject }> = [];
    [
      "targetEcosystems",
      "targetConectivity",
      "targetWaterStorage",
      "targetCarbonStorage",
      "targetAvoidedDeforestation",
      "targetRestoration",
    ].forEach((item) => {
      SearchAPI.requestSectionTexts(item)
        .then((res) => {
          targetsTexts.push({
            textKey: item,
            texts: {
              info: res.info,
              cons: res.cons,
              meto: res.meto,
              quote: res.quote,
            },
          });
        })
        .catch(() => {
          throw new Error("Error getting data");
        });
    });
    this.targetsTexts = targetsTexts;
  }

  /**
   * Get texts of a selected target
   *
   * @param {String} targetName target name
   *
   * @returns {Object | undefined} information texts of a target
   */
  getTargetText(targetName: string) {
    const targetTextKey =
      this.targets.find((obj) => obj.name === targetName)?.textKey ?? "";
    let targetTexts;
    const target = this.targetsTexts.find(
      (targetText) => targetTextKey === targetText.textKey
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
