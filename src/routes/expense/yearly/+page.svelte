<script lang="ts">
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import _ from "lodash";
  import { ajax, type Posting } from "$lib/utils";
  import {
    renderYearlyExpensesTimeline,
    renderCurrentExpensesBreakdown,
    renderCalendar,
    renderSelectedMonth
  } from "$lib/expense/yearly";
  import { dateMin, dateMax, year } from "../../../store";
  import { writable } from "svelte/store";

  let groups = writable([]);
  let z: d3.ScaleOrdinal<string, string, never>,
    renderer: (ps: Posting[]) => void,
    expenses: Posting[],
    grouped_expenses: Record<string, Posting[]>,
    grouped_incomes: Record<string, Posting[]>,
    grouped_investments: Record<string, Posting[]>,
    grouped_taxes: Record<string, Posting[]>;

  $: if (grouped_expenses) {
    renderCalendar(grouped_expenses[$year], z, $groups);
    renderSelectedMonth(
      renderer,
      grouped_expenses[$year] || [],
      grouped_incomes[$year] || [],
      grouped_taxes[$year] || [],
      grouped_investments[$year] || []
    );
  }

  onMount(async () => {
    ({
      expenses: expenses,
      year_wise: {
        expenses: grouped_expenses,
        incomes: grouped_incomes,
        investments: grouped_investments,
        taxes: grouped_taxes
      }
    } = await ajax("/api/expense"));

    const [start, end] = d3.extent(_.map(expenses, (e) => e.date));
    if (start) {
      dateMin.set(start);
      dateMax.set(end);
    }

    ({ z } = renderYearlyExpensesTimeline(expenses, groups, year));

    renderer = renderCurrentExpensesBreakdown(z);
  });
</script>

<section class="section tab-expense">
  <div class="container is-fluid">
    <div class="columns is-flex-wrap-wrap">
      <div class="column is-3">
        <div class="columns is-flex-wrap-wrap">
          <div class="column is-full">
            <div>
              <nav class="level">
                <div class="level-item is-narrow has-text-centered">
                  <div>
                    <p class="heading is-flex is-justify-content-space-between">Income</p>
                    <p class="d3-current-year-income title" />
                  </div>
                </div>
                <div class="level-item is-narrow has-text-centered">
                  <div>
                    <p class="heading is-flex is-justify-content-space-between">
                      <span>Tax</span><span
                        title="Tax Rate"
                        class="tag ml-2 has-text-weight-semibold d3-current-year-tax-rate"
                      />
                    </p>
                    <p class="d3-current-year-tax title" />
                  </div>
                </div>
              </nav>
            </div>
          </div>
          <div class="column is-full">
            <div>
              <nav class="level">
                <div class="level-item is-narrow has-text-centered">
                  <div>
                    <p class="heading is-flex is-justify-content-space-between">
                      <span>Net Investment</span><span
                        title="Savings Rate"
                        class="tag ml-2 has-text-weight-semibold d3-current-year-savings-rate"
                      />
                    </p>
                    <p class="d3-current-year-investment title" />
                  </div>
                </div>
                <div class="level-item is-narrow has-text-centered">
                  <div>
                    <p class="heading is-flex is-justify-content-space-between">
                      <span>Expenses</span><span
                        title="Expenses Rate"
                        class="tag ml-2 has-text-weight-semibold d3-current-year-expenses-rate"
                      />
                    </p>
                    <p class="d3-current-year-expenses title" />
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-3">
        <div class="px-3 box">
          <div id="d3-current-year-expense-calendar" class="d3-calendar">
            <div class="months" />
          </div>
        </div>
      </div>
      <div class="column is-full-tablet is-half-fullhd">
        <div class="px-3 box" style="height: 100%">
          <svg id="d3-current-year-breakdown" width="100%" />
        </div>
      </div>
      <div class="column is-12">
        <div class="box">
          <svg id="d3-yearly-expense-timeline" width="100%" height="500" />
        </div>
      </div>
      <div class="column is-12 has-text-centered">
        <div>
          <p class="heading">Yearly Expenses</p>
        </div>
      </div>
    </div>
  </div>
</section>
