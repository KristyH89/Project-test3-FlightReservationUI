package se.lexicon.flightbooking_api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import se.lexicon.flightbooking_api.entity.FlightBooking;
import se.lexicon.flightbooking_api.entity.FlightStatus;
import se.lexicon.flightbooking_api.repository.FlightBookingRepository;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@Profile("!test")
@RequiredArgsConstructor
public class FlightBookingDataRunner implements CommandLineRunner {

    private final FlightBookingRepository flightBookingRepository;

    @Override
    public void run(String... args) {

        // Skip seeding if flights already exist to prevent duplicate records.
        if (flightBookingRepository.count() > 0) {
            System.out.println("Flights already seeded, skipping data initialization.");
            return;
        }

        /*
         * Base date used for generating demo flights.
         * Every flight is scheduled relative to the current date so the seeded
         * data always stays in the future without requiring manual updates.
         */
        LocalDateTime baseDate = LocalDateTime.now()
                .withHour(0)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        // Available flights (7) — all departing from Amsterdam
        FlightBooking flight1 = FlightBooking.builder()
                .flightNumber("FL001")
                .origin("Amsterdam")
                .departureTime(baseDate.plusWeeks(6).plusDays(0).withHour(7).withMinute(15))
                .arrivalTime(baseDate.plusWeeks(6).plusDays(0).withHour(8).withMinute(45))
                .status(FlightStatus.AVAILABLE)
                .destination("Guernsey")
                .price( 169.99)
                .build();

        FlightBooking flight2 = FlightBooking.builder()
                .flightNumber("FL002")
                .origin("Amsterdam")
                .departureTime(baseDate.plusWeeks(6).plusDays(2).withHour(13).withMinute(40))
                .arrivalTime(baseDate.plusWeeks(6).plusDays(2).withHour(17).withMinute(10))
                .status(FlightStatus.AVAILABLE)
                .destination("Heraklion")
                .price( 299.99)
                .build();

        FlightBooking flight3 = FlightBooking.builder()
                .flightNumber("FL003")
                .origin("Amsterdam")
                .departureTime(baseDate.plusWeeks(6).plusDays(5).withHour(9).withMinute(5))
                .arrivalTime(baseDate.plusWeeks(6).plusDays(5).withHour(12).withMinute(5))
                .status(FlightStatus.AVAILABLE)
                .destination("Skopje")
                .price( 269.99)
                .build();

        FlightBooking flight4 = FlightBooking.builder()
                .flightNumber("FL004")
                .origin("Amsterdam")
                .departureTime(baseDate.plusWeeks(7).plusDays(0).withHour(16).withMinute(20))
                .arrivalTime(baseDate.plusWeeks(7).plusDays(0).withHour(17).withMinute(50))
                .status(FlightStatus.AVAILABLE)
                .destination("Zurich")
                .price( 219.99)
                .build();

        FlightBooking flight5 = FlightBooking.builder()
                .flightNumber("FL005")
                .origin("Amsterdam")
                .departureTime(baseDate.plusWeeks(7).plusDays(3).withHour(6).withMinute(50))
                .arrivalTime(baseDate.plusWeeks(7).plusDays(3).withHour(8).withMinute(50))
                .status(FlightStatus.AVAILABLE)
                .destination("Budapest")
                .price( 239.99)
                .build();

        FlightBooking flight6 = FlightBooking.builder()
                .flightNumber("FL006")
                .origin("Amsterdam")
                .departureTime(baseDate.plusWeeks(7).plusDays(6).withHour(8).withMinute(30))
                .arrivalTime(baseDate.plusWeeks(7).plusDays(6).withHour(14).withMinute(30))
                .status(FlightStatus.AVAILABLE)
                .destination("Sal")
                .price( 499.99)
                .build();

        FlightBooking flight7 = FlightBooking.builder()
                .flightNumber("FL007")
                .origin("Amsterdam")
                .departureTime(baseDate.plusWeeks(8).plusDays(2).withHour(10).withMinute(30))
                .arrivalTime(baseDate.plusWeeks(8).plusDays(2).withHour(21).withMinute(30))
                .status(FlightStatus.AVAILABLE)
                .destination("San Francisco")
                .price( 899.99)
                .build();

        // Booked flights (3)
        FlightBooking bookedFlight1 = FlightBooking.builder()
                .flightNumber("FL008")
                .origin("Amsterdam")
                .passengerName("Jeroen de Vries")
                .passengerEmail("jeroen.devries@example.com")
                .departureTime(baseDate.plusWeeks(6).plusDays(1).withHour(8).withMinute(0))
                .arrivalTime(baseDate.plusWeeks(6).plusDays(1).withHour(10).withMinute(0))
                .status(FlightStatus.BOOKED)
                .destination("Gothenburg")
                .price( 189.99)
                .build();

        FlightBooking bookedFlight2 = FlightBooking.builder()
                .flightNumber("FL009")
                .origin("Amsterdam")
                .passengerName("Fleur van Beek")
                .passengerEmail("fleur.vanbeek@example.com")
                .departureTime(baseDate.plusWeeks(6).plusDays(6).withHour(10).withMinute(0))
                .arrivalTime(baseDate.plusWeeks(6).plusDays(6).withHour(13).withMinute(30))
                .status(FlightStatus.BOOKED)
                .destination("Istanbul")
                .price( 349.99)
                .build();

        FlightBooking bookedFlight3 = FlightBooking.builder()
                .flightNumber("FL010")
                .origin("Amsterdam")
                .passengerName("Bram Visser")
                .passengerEmail("bram.visser@example.com")
                .departureTime(baseDate.plusWeeks(7).plusDays(2).withHour(12).withMinute(0))
                .arrivalTime(baseDate.plusWeeks(7).plusDays(2).withHour(14).withMinute(30))
                .status(FlightStatus.BOOKED)
                .destination("Rome")
                .price( 249.99)
                .build();

        // Save all flights
        Arrays.asList(
                flight1,
                flight2,
                flight3,
                flight4,
                flight5,
                flight6,
                flight7,
                bookedFlight1,
                bookedFlight2,
                bookedFlight3
        ).forEach(flight -> {
            try {
                flightBookingRepository.save(flight);
                System.out.println("Created flight: "
                        + flight.getFlightNumber()
                        + " (Status: "
                        + flight.getStatus()
                        + ", "
                        + flight.getOrigin()
                        + " -> "
                        + flight.getDestination()
                        + ")");
            } catch (Exception e) {
                System.err.println("Error creating flight: "
                        + flight.getFlightNumber()
                        + " - "
                        + e.getMessage());
            }
        });

        // Print summary
        System.out.println("\nFlight Booking Statistics:");
        System.out.println("Total flights: " + flightBookingRepository.findAll().size());

        System.out.println("Available flights: " +
                flightBookingRepository.findAll().stream()
                        .filter(f -> f.getStatus() == FlightStatus.AVAILABLE)
                        .count());

        System.out.println("Booked flights: " +
                flightBookingRepository.findAll().stream()
                        .filter(f -> f.getStatus() == FlightStatus.BOOKED)
                        .count());
    }
}