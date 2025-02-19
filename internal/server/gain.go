package server

import (
	"github.com/ananthakumaran/paisa/internal/model/posting"
	"github.com/ananthakumaran/paisa/internal/query"
	"github.com/ananthakumaran/paisa/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
	"gorm.io/gorm"
)

type Gain struct {
	Account  string            `json:"account"`
	Networth Networth          `json:"networth"`
	XIRR     float64           `json:"xirr"`
	Postings []posting.Posting `json:"postings"`
}

type AccountGain struct {
	Account          string            `json:"account"`
	NetworthTimeline []Networth        `json:"networthTimeline"`
	XIRR             float64           `json:"xirr"`
	Postings         []posting.Posting `json:"postings"`
}

func GetGain(db *gorm.DB) gin.H {
	postings := query.Init(db).Unbudgeted().Like("Assets:%").NotLike("Assets:Checking").All()
	postings = service.PopulateMarketPrice(db, postings)
	byAccount := lo.GroupBy(postings, func(p posting.Posting) string { return p.Account })
	var gains []Gain
	for account, ps := range byAccount {
		gains = append(gains, Gain{Account: account, XIRR: service.XIRR(db, ps), Networth: computeNetworth(db, ps), Postings: ps})
	}

	return gin.H{"gain_breakdown": gains}
}

func GetAccountGain(db *gorm.DB, account string) gin.H {
	accountPostingsQuery := query.Init(db).AccountPrefix(account)
	forecastedPostings := accountPostingsQuery.Clone().Forecasted().All()
	postings := accountPostingsQuery.Unbudgeted().All()
	postings = service.PopulateMarketPrice(db, postings)
	allPostings := append(postings, forecastedPostings...)
	gain := AccountGain{Account: account, XIRR: service.XIRR(db, postings), NetworthTimeline: computeNetworthTimeline(db, allPostings), Postings: allPostings}

	commodities := lo.Uniq(lo.Map(postings, func(p posting.Posting, _ int) string { return p.Commodity }))
	var portfolio_groups PortfolioAllocationGroups
	portfolio_groups = GetAccountPortfolioAllocation(db, account)
	if !(len(commodities) > 0 && len(portfolio_groups.Commomdities) == len(commodities)) {
		portfolio_groups = PortfolioAllocationGroups{Commomdities: []string{}, NameAndSecurityType: []PortfolioAggregate{}, SecurityType: []PortfolioAggregate{}, Rating: []PortfolioAggregate{}, Industry: []PortfolioAggregate{}}
	}

	return gin.H{"gain_timeline_breakdown": gain, "portfolio_allocation": portfolio_groups}
}
